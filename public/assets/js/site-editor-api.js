/* Heponla Canli Site Editoru - backend baglantisi (tasarimcinin kontratina gore
   yazilimci tarafindan dolduruldu). Kimlik: /yonetim/ ile ayni admin oturumu
   (sessionStorage hepon_admin, x-admin basligi). */
window.HEPONLA_CMS_CONFIG = {
  demoMode: false,
  saveDraftEndpoint: "/api/cms/drafts",
  publishEndpoint: "/api/cms/publish",
  mediaUploadEndpoint: "/api/cms/media",
  currentUserEndpoint: "/api/auth/session"
};

window.addEventListener("DOMContentLoaded", () => {
  const config = window.HEPONLA_CMS_CONFIG;
  const token = sessionStorage.getItem("hepon_admin") || "";

  // oturum kontrolu: gecersizse icerik paneline (giris oradan) gonder
  fetch(config.currentUserEndpoint, { headers: { "x-admin": token } })
    .then((r) => r.json())
    .then((o) => {
      if (!o || o.error) {
        alert("Önce İçerik Yönetimi panelinden giriş yapın; editör oradan açılır.");
        window.location.href = "/icerik/";
      }
    })
    .catch(() => undefined);

  // /icerik/ panelinden #/sayfa/ ile gelinirse o sayfayla acil
  if (location.hash.length > 1) {
    const hedefSayfa = decodeURIComponent(location.hash.slice(1));
    const sec = document.querySelector("#lePage");
    if (sec && [...sec.options].some((o) => o.value === hedefSayfa)) {
      sec.value = hedefSayfa;
      const frame = document.querySelector("#leFrame");
      if (frame) frame.src = hedefSayfa;
    }
  }

  const saveButton = document.querySelector("#leSaveAll");
  if (!saveButton) return;

  const durum = (mesaj) => {
    saveButton.textContent = mesaj;
    setTimeout(() => { saveButton.textContent = "Taslak kaydet"; }, 2500);
  };

  // Yayinla dugmesi (tasarim taslak kaydetle bitiyor; yayin adimini biz ekledik)
  const yayinBtn = document.createElement("button");
  yayinBtn.className = "le-action primary";
  yayinBtn.id = "leYayinla";
  yayinBtn.textContent = "Yayınla";
  yayinBtn.style.background = "#1DB586";
  saveButton.after(yayinBtn);
  yayinBtn.onclick = async () => {
    let toplam = 0, tamam = true;
    for (const sayfa of [document.querySelector("#lePage")?.value || "/", "*"]) {
      const cevap = await fetch(config.publishEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin": token },
        body: JSON.stringify({ page: sayfa }),
      }).then((r) => r.json()).catch(() => null);
      if (cevap && cevap.ok) toplam += cevap.yayinlanan; else tamam = false;
    }
    yayinBtn.textContent = tamam ? `✓ ${toplam} değişiklik yayında` : "Yayınlanamadı";
    setTimeout(() => { yayinBtn.textContent = "Yayınla"; }, 2500);
  };

  saveButton.onclick = async () => {
    const degisiklikler = window.heponlaLiveEditorChanges || [];
    if (!degisiklikler.length) { durum("Değişiklik yok"); return; }
    const varsayilan = document.querySelector("#lePage")?.value || "/";
    // kayitlar kendi sayfa degerini tasir ('*' = header/footer, tum sayfalar)
    const gruplar = {};
    for (const d of degisiklikler) {
      const sayfa = d.page || varsayilan;
      (gruplar[sayfa] = gruplar[sayfa] || []).push(d);
    }
    let toplam = 0, hata = null;
    for (const [sayfa, grup] of Object.entries(gruplar)) {
      const cevap = await fetch(config.saveDraftEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin": token },
        body: JSON.stringify({ page: sayfa, changes: grup, status: "draft" }),
      }).then((r) => r.json()).catch(() => null);
      if (cevap && cevap.ok) toplam += cevap.kaydedilen;
      else hata = (cevap && cevap.error) || "Kaydedilemedi";
    }
    if (!hata) {
      degisiklikler.length = 0;
      durum(`✓ ${toplam} taslak kaydedildi`);
    } else {
      durum(hata);
    }
  };

  // ---- Stil kontrolleri: buton/metin rengi, arka plan rengi ve gorseli ----
  // (yazilimci eklentisi; kayitlar style alaniyla /api/cms/drafts'a gider)
  const seciciUret = (e) => {
    if (e.dataset && e.dataset.heponEdit) return "data-hepon-edit: " + e.dataset.heponEdit;
    const t = e.tagName.toLowerCase();
    if (e.id) return t + "#" + e.id;
    const w = e.closest("[data-id]");
    if (w) {
      if (w === e) return `[data-id="${w.getAttribute("data-id")}"]`;
      const ayni = [...w.querySelectorAll(t)];
      const n = ayni.indexOf(e);
      return `[data-id="${w.getAttribute("data-id")}"] ${t}@${n < 0 ? 0 : n}`;
    }
    return t;
  };
  const seciliEl = () => document.querySelector("#leFrame")?.contentDocument
    ?.querySelector("[data-hepon-live-selected]");
  const kayitEkle = (el, style) => {
    const kayit = {
      selector: seciciUret(el), tag: el.tagName, text: null, href: null, src: null,
      style, page: el.closest("header, footer") ? "*" : (document.querySelector("#lePage")?.value || "/"),
    };
    (window.heponlaLiveEditorChanges = window.heponlaLiveEditorChanges || []).push(kayit);
  };

  const fields = document.querySelector("#leFields");
  if (fields) {
    fields.insertAdjacentHTML("beforeend", `
      <div class="le-field"><label>METİN RENGİ / ARKA PLAN RENGİ</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="leMetinRenk" type="color" title="Metin rengi" style="width:44px;height:34px;border:1px solid #dfe9ee;border-radius:8px;padding:2px">
          <input id="leZeminRenk" type="color" title="Arka plan rengi" value="#30B6E4" style="width:44px;height:34px;border:1px solid #dfe9ee;border-radius:8px;padding:2px">
          <button id="leRenkUygula" type="button" style="flex:1;padding:8px;border:1px solid #dfe9ee;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;font-size:12px">Renkleri uygula</button>
        </div></div>
      <div class="le-field"><label>BÖLÜM ARKA PLAN GÖRSELİ</label>
        <input id="leBgDosya" type="file" accept="image/*" style="font-size:10px">
        <p style="font-size:10.5px;color:#708191;margin:6px 0 0">Seçili öğenin içinde bulunduğu bölümün arka planını değiştirir.</p></div>`);

    document.querySelector("#leRenkUygula").onclick = () => {
      const el = seciliEl();
      if (!el) return alert("Önce sayfadan bir öğe seçin.");
      const stil = {
        color: document.querySelector("#leMetinRenk").value,
        "background-color": document.querySelector("#leZeminRenk").value,
      };
      el.style.setProperty("color", stil.color, "important");
      el.style.setProperty("background-color", stil["background-color"], "important");
      kayitEkle(el, stil);
    };

    document.querySelector("#leBgDosya").addEventListener("change", async (ev) => {
      const dosya = ev.target.files[0];
      const el = seciliEl();
      if (!dosya) return;
      if (!el) return alert("Önce sayfadan bir öğe seçin.");
      const kap = el.closest(".e-con[data-id], section[data-id], div[data-id]") || el;
      const f = new FormData();
      f.append("dosya", dosya);
      const cevap = await fetch(config.mediaUploadEndpoint, {
        method: "POST", headers: { "x-admin": token }, body: f,
      }).then((r) => r.json()).catch(() => null);
      if (!(cevap && cevap.ok)) return alert((cevap && cevap.error) || "Görsel yüklenemedi");
      const stil = {
        "background-image": `url('${cevap.url}')`,
        "background-size": "cover",
        "background-position": "center",
      };
      for (const [k, v] of Object.entries(stil)) kap.style.setProperty(k, v, "important");
      kayitEkle(kap, stil);
      ev.target.value = "";
    });
  }

  // Editörün kendi kaydına ek: header/footer içi öğeler tüm sayfalarda ortak
  // olduğundan kaydı '*' sayfasına işaretle (menü/footer düzenlemeleri global olur)
  const applyBtn = document.querySelector("#leApply");
  if (applyBtn) {
    const orijinal = applyBtn.onclick;
    applyBtn.onclick = (e) => {
      if (orijinal) orijinal.call(applyBtn, e);
      const el = seciliEl();
      const degisiklikler = window.heponlaLiveEditorChanges || [];
      const son = degisiklikler[degisiklikler.length - 1];
      if (el && son && el.closest("header, footer")) son.page = "*";
    };
  }

  // Gorsel dosyasi secilince gercek yukleme yap (blob URL kalici degildir)
  const imageFile = document.querySelector("#leImageFile");
  const imageUrl = document.querySelector("#leImage");
  if (imageFile && imageUrl) {
    imageFile.addEventListener("change", async () => {
      const dosya = imageFile.files[0];
      if (!dosya) return;
      const f = new FormData();
      f.append("dosya", dosya);
      const cevap = await fetch(config.mediaUploadEndpoint, {
        method: "POST", headers: { "x-admin": token }, body: f,
      }).then((r) => r.json()).catch(() => null);
      if (cevap && cevap.ok) {
        imageUrl.value = cevap.url;
        const secili = document.querySelector("#leFrame")?.contentDocument
          ?.querySelector('[data-hepon-live-selected]');
        if (secili && secili.tagName === "IMG") secili.src = cevap.url;
      } else {
        alert((cevap && cevap.error) || "Görsel yüklenemedi (10 MB, jpg/png/webp/gif/svg)");
      }
    });
  }
});
