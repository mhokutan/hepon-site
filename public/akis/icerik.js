// Icerik Yonetimi paneli (tasarimcinin /icerik/ prototipi uzerine).
// - Yonetici girisi olmadan panel acilmaz (yonetim ile ayni oturum)
// - "Medya ve gorseller" bolumu gercek Gorsel Yoneticisi API'sine baglidir
// - Diger bolumler (sayfa/menu/footer/SEO) su an prototip: backend'i yol haritasinda
(() => {
  "use strict";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tarih = (t) => t ? new Date(t).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  const stil = document.createElement("style");
  stil.textContent = `
    .yp-perde{position:fixed;inset:0;z-index:999999;background:#0B1220;display:flex;align-items:center;justify-content:center;padding:24px;font-family:inherit}
    .yp-kutu{width:100%;max-width:380px;background:#fff;border-radius:20px;padding:30px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
    .yp-kutu h2{margin:0 0 4px;color:#13263D;font-size:21px}
    .yp-kutu p{margin:0 0 18px;color:#6F7E90;font-size:13.5px}
    .yp-kutu label{display:block;font-size:12.5px;font-weight:600;color:#6F7E90;margin:12px 0 5px}
    .yp-kutu input{width:100%;box-sizing:border-box;padding:11px 13px;border:1.5px solid #DFE8ED;border-radius:12px;font-size:15px;font-family:inherit}
    .yp-hata{display:none;background:#FDECEC;color:#D84C4C;border-radius:10px;padding:9px 12px;font-size:13px;margin-top:12px}
    .yp-hata.goster{display:block}
    .yp-btn{width:100%;margin-top:16px;border:none;border-radius:999px;padding:13px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;background:#30B6E4;color:#fff}
    .ic-not{background:#FFF7E6;color:#8A6100;border-radius:12px;padding:10px 14px;font-size:13px;margin:10px 0}
    .ic-liste div{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #EDF3F6;font-size:13.5px;color:#13263D}
    .ic-liste img{width:56px;height:38px;object-fit:cover;border-radius:8px}
    .ic-liste span{color:#6F7E90;font-size:12px;display:block}
    .ic-liste button{margin-left:auto;border:1px solid #DFE8ED;background:#fff;border-radius:999px;padding:5px 12px;font-size:12px;font-family:inherit;cursor:pointer}`;
  document.head.appendChild(stil);

  const perde = document.createElement("div");
  perde.className = "yp-perde";
  perde.innerHTML = `<div class="yp-kutu">
    <h2>İçerik Yönetimi</h2>
    <p>Bu alan yalnızca yetkili yönetici içindir.</p>
    <label>Kullanıcı adı</label><input id="icKullanici" autocomplete="username">
    <label>Şifre</label><input id="icSifre" type="password" autocomplete="current-password">
    <div class="yp-hata" id="icHata"></div>
    <button class="yp-btn" id="icGiris" type="button">Giriş yap</button>
  </div>`;
  document.body.appendChild(perde);

  let token = sessionStorage.getItem("hepon_admin") || "";
  const api = (yol, secenek = {}) => fetch("/api/admin" + yol, {
    ...secenek, headers: { "x-admin": token, ...(secenek.headers || {}) },
  }).then((r) => r.json());
  // tam yol isteyen uclar icin (orn. /api/cms/*)
  const api2 = (yol, secenek = {}) => fetch(yol, {
    ...secenek, headers: { "x-admin": token, ...(secenek.headers || {}) },
  }).then((r) => r.json());

  async function girisDene() {
    const hata = document.getElementById("icHata");
    hata.classList.remove("goster");
    const cevap = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: document.getElementById("icKullanici").value.trim(),
        password: document.getElementById("icSifre").value,
      }),
    }).then((r) => r.json()).catch(() => null);
    if (!cevap || !cevap.token) {
      hata.textContent = (cevap && cevap.error) || "Giriş yapılamadı.";
      hata.classList.add("goster");
      return;
    }
    token = cevap.token;
    sessionStorage.setItem("hepon_admin", token);
    perde.remove();
    baglan();
  }
  perde.querySelector("#icGiris").addEventListener("click", girisDene);
  perde.addEventListener("keydown", (e) => { if (e.key === "Enter") girisDene(); });

  const SAYFALAR = [
    ["Ana Sayfa", "/"], ["Hakkımızda", "/hakkimizda/"], ["Trafik Sigortası", "/trafik-sigortasi/"],
    ["Kasko Sigortası", "/kasko-sigortasi/"], ["İMM Sigortası", "/imm-sigortasi/"],
    ["DASK Sigortası", "/dask-sigortasi/"], ["Seyahat Sağlık", "/seyahat-saglik-sigortasi/"],
    ["Tamamlayıcı Sağlık", "/tamamlayici-saglik-sigortasi/"], ["Yabancı Sağlık", "/yabanci-saglik-sigortasi/"],
    ["Ferdi Kaza", "/ferdi-kaza-sigortasi/"], ["Mesleki Sorumluluk", "/mesleki-sorumluluk-sigortalari/"],
    ["Üyelik", "/uyelik/"], ["Hesabım", "/hesabim/"],
  ];

  async function havuzListesiCiz() {
    const kap = document.getElementById("icHavuz");
    if (!kap) return;
    const liste = await api("/dosyalar");
    if (!Array.isArray(liste)) return;
    kap.innerHTML = "<b style='font-size:13px'>Yüklenen dosyalar</b>" + (liste.slice(0, 12).map((d) =>
      `<div>📄 <div>${esc(d.ad)}<span>${(d.boyut / 1024).toFixed(0)} KB · ${tarih(d.tarih)}</span></div></div>`).join("") ||
      "<div>Henüz dosya yok.</div>");
  }

  async function medyaListesiCiz() {
    const kap = document.getElementById("icDegisenler");
    if (!kap) return;
    const liste = await api("/gorseller");
    if (!Array.isArray(liste)) return;
    kap.innerHTML = "<b style='font-size:13px'>Değiştirilmiş görseller</b>" + (liste.map((g) => `
      <div><img src="/gorseller/${esc(g.yeni_dosya)}" alt="">
        <div>${esc(g.eski_src.split("/").pop())}<span>${esc(g.sayfa || "-")} · ${tarih(g.updated_at)}</span></div>
        <button data-geri="${g.id}">İlk haline döndür</button></div>`).join("") ||
      "<div>Henüz değiştirilmiş görsel yok.</div>");
    kap.onclick = async (e) => {
      const b = e.target.closest("[data-geri]");
      if (!b) return;
      await api("/gorseller/" + b.dataset.geri + "/geri-al", { method: "PATCH" });
      medyaListesiCiz();
    };
  }

  function baglan() {
    // MEDYA bolumu: gercek sisteme baglanir
    const medya = document.querySelector('[data-se-view="media"]');
    if (medya) {
      // hedef sayfa secimi + gercek atama akisi
      const sec = medya.querySelector("select");
      if (sec) sec.innerHTML = SAYFALAR.map(([ad, yol]) => `<option value="${yol}">${ad}</option>`).join("");
      const ata = [...medya.querySelectorAll("button")].find((b) => b.textContent.includes("Görseli ata"));
      if (ata) {
        ata.addEventListener("click", () => {
          const yol = sec ? sec.value : "/";
          window.open(yol + "?duzenle=1", "_blank");
        });
        ata.insertAdjacentHTML("afterend",
          '<p style="font-size:12px;color:#6F7E90;margin-top:8px">Seçtiğin sayfa düzenleme modunda açılır; görselin üstündeki ✎ ile değiştir, anında yayına girer.</p>');
      }
      // kutuphaneye dosya yukleme (eski /yukle/ paneli buraya tasindi; havuz: ~/gelen-dosyalar)
      const girdi = medya.querySelector("#seFile");
      if (girdi) {
        girdi.removeAttribute("accept"); // tasarim teslimleri zip/json da olabilir
        girdi.addEventListener("change", async () => {
          const d = girdi.files[0];
          if (!d) return;
          const f = new FormData();
          f.append("dosya", d);
          const cevap = await api("/dosya-yukle", { method: "POST", body: f });
          const adEl = document.getElementById("seFileName");
          if (adEl) adEl.textContent = cevap.ok ? `✓ Yüklendi: ${cevap.ad}` : (cevap.error || "Yükleme başarısız");
          const kutu = document.getElementById("seUploaded");
          if (kutu) kutu.style.display = "flex";
          havuzListesiCiz();
        });
      }
      // havuzdaki dosyalar (tasarimci teslimleri)
      const kutuphaneKart = medya.querySelector(".se-card");
      if (kutuphaneKart) {
        kutuphaneKart.insertAdjacentHTML("beforeend", '<div class="ic-liste" id="icHavuz"></div>');
        havuzListesiCiz();
      }
      // degisen gorseller listesi
      const kart = medya.querySelector(".se-card");
      if (kart) kart.insertAdjacentHTML("beforeend", '<div class="ic-liste" id="icDegisenler"></div>');
      medyaListesiCiz();
    }

    // Sayfa editoru / Menuler / Footer: gercek duzenleme Canli Site Editorunde.
    // Prototip formlar kaldirilip calisan kisayollara donusturulur.
    const kisayol = (baslik, aciklama) => `
      <article class="se-card"><div class="se-card-head"><b>${baslik}</b><span>${aciklama}</span></div>
        <div class="se-inspector" style="padding:16px">
          <p style="font-size:13px;color:#6F7E90;margin:0 0 12px">Sayfayı seç, editörde aç; öğeye tıkla → metni, bağlantıyı, rengi veya görseli değiştir → <b>Taslak kaydet</b> → <b>Yayınla</b>.</p>
          <div class="se-field"><label>SAYFA</label><select class="ic-sayfa-sec">${SAYFALAR.map(([ad, yol]) => `<option value="${yol}">${ad}</option>`).join("")}</select></div>
          <button class="se-btn primary ic-editor-ac" style="margin-top:10px">Canlı Editörde Aç →</button>
        </div></article>`;

    [["visual", "Sayfa içeriği", "Başlık, açıklama, buton metni/rengi, görseller"],
     ["menus", "Menü düzenleme", "Menü öğesine editörde tıkla; metin/bağlantı değişikliği tüm sayfalara uygulanır"],
     ["footer", "Footer düzenleme", "Footer öğesine editörde tıkla; değişiklik tüm sayfalara uygulanır"]].forEach(([k, b, a]) => {
      const v = document.querySelector(`[data-se-view="${k}"]`);
      if (v) v.innerHTML = kisayol(b, a);
    });
    document.querySelectorAll(".ic-editor-ac").forEach((b) => {
      b.addEventListener("click", () => {
        const sec = b.closest(".se-inspector").querySelector(".ic-sayfa-sec");
        window.open("/icerik/editor/#" + encodeURIComponent(sec.value), "_blank");
      });
    });

    // SEO bolumu: gercek kayit (per sayfa __seo__ kaydi, kaydet = taslak + yayin)
    const seo = document.querySelector('[data-se-view="seo"]');
    if (seo) {
      seo.innerHTML = `
        <article class="se-card"><div class="se-card-head"><b>SEO ayarları</b><span>Sayfa başlığı ve açıklaması (kaydedince yayına girer)</span></div>
          <div class="se-inspector" style="padding:16px">
            <div class="se-field"><label>SAYFA</label><select id="icSeoSayfa">${SAYFALAR.map(([ad, yol]) => `<option value="${yol}">${ad}</option>`).join("")}</select></div>
            <div class="se-field"><label>SEO TITLE</label><input id="icSeoTitle" placeholder="Örn. Heponla | Sigorta Tekliflerini Karşılaştır"></div>
            <div class="se-field"><label>META DESCRIPTION</label><textarea id="icSeoDesc" rows="3" placeholder="Arama sonuçlarında görünecek açıklama"></textarea></div>
            <button class="se-btn primary" id="icSeoKaydet" style="margin-top:10px">Kaydet ve yayınla</button>
            <span id="icSeoDurum" style="margin-left:10px;font-size:12.5px;color:#1DB586"></span>
          </div></article>`;
      document.getElementById("icSeoKaydet").addEventListener("click", async () => {
        const sayfa = document.getElementById("icSeoSayfa").value;
        const cevap = await api2("/api/cms/drafts", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: sayfa, changes: [{ selector: "__seo__", tag: "SEO",
            style: { title: document.getElementById("icSeoTitle").value, description: document.getElementById("icSeoDesc").value } }] }),
        });
        if (cevap && cevap.ok) await api2("/api/cms/publish", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: sayfa }) });
        document.getElementById("icSeoDurum").textContent = (cevap && cevap.ok) ? "✓ Yayında" : "Kaydedilemedi";
        setTimeout(() => { document.getElementById("icSeoDurum").textContent = ""; }, 2500);
      });
    }

    // Taslaklar: gercek CMS kayit listesi + geri alma + tumunu yayinla
    const surumler = document.querySelector('[data-se-view="versions"]');
    if (surumler) {
      surumler.innerHTML = `
        <article class="se-card"><div class="se-card-head"><b>Değişiklik kayıtları</b><span>Editörden yapılan tüm düzenlemeler</span></div>
          <div style="padding:16px">
            <button class="se-btn primary" id="icTumYayinla">Bekleyen taslakların tümünü yayınla</button>
            <div class="ic-liste" id="icCmsListe" style="margin-top:12px"></div>
          </div></article>`;
      const cmsListe = async () => {
        const liste = await api2("/api/cms/liste");
        const kap = document.getElementById("icCmsListe");
        if (!kap || !Array.isArray(liste)) return;
        kap.innerHTML = liste.map((k) => `
          <div>✏️ <div>${esc(k.sayfa)} · ${esc(k.secici.slice(0, 55))}
            <span>${k.yayin_var ? "yayında" : "taslak"}${k.bekleyen ? " · bekleyen değişiklik var" : ""} · ${tarih(k.updated_at)}</span></div>
            <button data-cms-sil="${k.id}">Geri al</button></div>`).join("") || "<div>Henüz değişiklik yok.</div>";
        kap.onclick = async (e) => {
          const b = e.target.closest("[data-cms-sil]");
          if (!b) return;
          await api2("/api/cms/" + b.dataset.cmsSil, { method: "DELETE" });
          cmsListe();
        };
      };
      document.getElementById("icTumYayinla").addEventListener("click", async () => {
        await api2("/api/cms/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        cmsListe();
      });
      cmsListe();
    }
  }

  if (token) {
    api("/ozet").then((o) => {
      if (!o.error) { perde.remove(); baglan(); }
      else sessionStorage.removeItem("hepon_admin");
    });
  }
})();
