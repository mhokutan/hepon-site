/*
 * Heponla CMS adapter
 * API uçları hazır olduğunda demoMode değerini false yapın.
 */
window.HEPONLA_CMS_CONFIG = {
  demoMode: false,
  saveDraftEndpoint: "/api/cms/drafts",
  publishEndpoint: "/api/cms/publish",
  createComponentEndpoint: "/api/cms/components",
  updateComponentEndpoint: "/api/cms/components/:id",
  deleteComponentEndpoint: "/api/cms/components/:id",
  mediaUploadEndpoint: "/api/cms/media",
  currentUserEndpoint: "/api/auth/session"
};

window.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("#heponLiveEditor");
  const config = window.HEPONLA_CMS_CONFIG;

  // oturum kontrolu: giris /icerik/ panelinden yapilir
  fetch(config.currentUserEndpoint, {
    credentials: "include",
    headers: { "x-admin": sessionStorage.getItem("hepon_admin") || "" }
  }).then((r) => r.json()).then((o) => {
    if (!o || o.error) {
      alert("Önce İçerik Yönetimi panelinden giriş yapın; editör oradan açılır.");
      window.location.href = "/icerik/";
    }
  }).catch(() => undefined);

  // /icerik/ panelinden #/sayfa/ ile gelinirse o sayfayla acil
  if (location.hash.length > 1) {
    const hedefSayfa = decodeURIComponent(location.hash.slice(1));
    const sec = document.querySelector("#lePage");
    if (sec && [...sec.options].some((x) => x.value === hedefSayfa)) {
      sec.value = hedefSayfa;
      const cerceve = document.querySelector("#leFrame");
      if (cerceve) cerceve.src = hedefSayfa;
    }
  }
  const saveButton = document.querySelector("#leSaveAll");
  const fields = document.querySelector("#leFields");
  if (!root || !saveButton || !fields) return;

  const status = document.createElement("p");
  status.style.cssText = "margin:8px 0 0;color:#718193;font:600 9px Poppins,Arial,sans-serif;line-height:1.5";
  saveButton.parentElement.appendChild(status);

  const publishButton = document.createElement("button");
  publishButton.type = "button";
  publishButton.className = "le-save-element";
  publishButton.textContent = "Yayınla";
  publishButton.style.marginTop = "9px";

  const duplicateButton = document.createElement("button");
  duplicateButton.type = "button";
  duplicateButton.className = "le-save-element";
  duplicateButton.textContent = "Seçili alanı kopyala";
  duplicateButton.style.cssText = "margin-top:9px;background:#eff8fb!important;color:#1883A8!important;border:1px solid #bce5f1";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "le-save-element";
  deleteButton.textContent = "Seçili alanı sil";
  deleteButton.style.cssText = "margin-top:9px;background:#fff4f4!important;color:#bf4f4f!important;border:1px solid #f1caca";

  fields.append(publishButton, duplicateButton, deleteButton);

  const payload = (statusType) => ({
    page: document.querySelector("#lePage")?.value || "/",
    status: statusType,
    changes: window.heponlaLiveEditorChanges || []
  });

  async function request(endpoint, body) {
    if (config.demoMode) {
      status.textContent = "Demo modu açık: değişiklik yalnızca önizlemede. Backend endpointi bekleniyor.";
      return { demo: true };
    }
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-admin": sessionStorage.getItem("hepon_admin") || ""
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("CMS isteği başarısız oldu.");
    const veri = await response.json();
    if (veri && veri.error) throw new Error(veri.error);
    return veri;
  }

  saveButton.onclick = async () => {
    try {
      status.textContent = "Taslak kaydediliyor…";
      await request(config.saveDraftEndpoint, payload("draft"));
      status.textContent = config.demoMode ? status.textContent : "Taslak kaydedildi.";
    } catch (error) {
      status.textContent = "Taslak kaydedilemedi: CMS backend bağlantısı gerekli.";
    }
  };

  publishButton.onclick = async () => {
    try {
      status.textContent = "Yayın hazırlanıyor…";
      await request(config.publishEndpoint, payload("published"));
      status.textContent = config.demoMode
        ? status.textContent
        : "Yayınlandı. Cache temizleme ve site yeniden oluşturma işlemi başlatıldı.";
    } catch (error) {
      status.textContent = "Yayınlanamadı: /api/cms/publish endpointi gerekli.";
    }
  };

  duplicateButton.onclick = () => {
    const selected = window.heponlaLiveEditorSelected;
    if (!selected) return (status.textContent = "Önce kopyalanacak alanı seçin.");
    const clone = selected.cloneNode(true);
    clone.removeAttribute("data-hepon-live-selected");
    clone.style.outline = "";
    selected.after(clone);
    (window.heponlaLiveEditorChanges ||= []).push({
      action: "duplicate",
      selector: selected.dataset.heponEdit || selected.tagName.toLowerCase(),
      page: document.querySelector("#lePage")?.value || "/"
    });
    status.textContent = "Alan önizlemede kopyalandı. Kaydettiğinizde backend bileşen kaydı oluşturacak.";
  };

  deleteButton.onclick = () => {
    const selected = window.heponlaLiveEditorSelected;
    if (!selected) return (status.textContent = "Önce silinecek alanı seçin.");
    if (!confirm("Bu alan önizlemeden kaldırılacak. Devam edilsin mi?")) return;
    (window.heponlaLiveEditorChanges ||= []).push({
      action: "delete",
      selector: selected.dataset.heponEdit || selected.tagName.toLowerCase(),
      page: document.querySelector("#lePage")?.value || "/"
    });
    selected.remove();
    window.heponlaLiveEditorSelected = null;
    status.textContent = "Alan önizlemeden kaldırıldı. Kalıcı silme yayınlama API’siyle yapılacak.";
  };

  // ---- yazilimci eklentileri: gercek medya yuklemesi + stil kontrolleri ----
  const token = () => sessionStorage.getItem("hepon_admin") || "";
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
  const kayitEkle = (el, style) => {
    (window.heponlaLiveEditorChanges ||= []).push({
      selector: seciciUret(el), tag: el.tagName, text: null, href: null, src: null, style,
      page: el.closest("header, footer") ? "*" : (document.querySelector("#lePage")?.value || "/"),
    });
  };

  const imageFile = document.querySelector("#leImageFile");
  const imageUrl = document.querySelector("#leImage");
  if (imageFile && imageUrl) {
    imageFile.addEventListener("change", async () => {
      const dosya = imageFile.files[0];
      if (!dosya) return;
      const f = new FormData();
      f.append("dosya", dosya);
      const cevap = await fetch(config.mediaUploadEndpoint, {
        method: "POST", credentials: "include", headers: { "x-admin": token() }, body: f,
      }).then((r) => r.json()).catch(() => null);
      if (cevap && cevap.ok) {
        imageUrl.value = cevap.url;
        const sec = window.heponlaLiveEditorSelected;
        if (sec && sec.tagName === "IMG") sec.src = cevap.url;
        status.textContent = "Görsel sunucuya yüklendi: " + cevap.url;
      } else {
        status.textContent = (cevap && cevap.error) || "Görsel yüklenemedi (10 MB, jpg/png/webp/gif/svg)";
      }
    });
  }

  fields.insertAdjacentHTML("beforeend", `
    <div class="le-field"><label>METİN RENGİ / ARKA PLAN RENGİ</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="leMetinRenk" type="color" title="Metin rengi" style="width:44px;height:34px;border:1px solid #dfe9ee;border-radius:8px;padding:2px">
        <input id="leZeminRenk" type="color" title="Arka plan rengi" value="#30B6E4" style="width:44px;height:34px;border:1px solid #dfe9ee;border-radius:8px;padding:2px">
        <button id="leRenkUygula" type="button" style="flex:1;padding:8px;border:1px solid #dfe9ee;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;font-size:12px">Renkleri uygula</button>
      </div></div>
    <div class="le-field"><label>BÖLÜM ARKA PLAN GÖRSELİ</label>
      <input id="leBgDosya" type="file" accept="image/*" style="font-size:10px"></div>`);

  document.querySelector("#leRenkUygula").onclick = () => {
    const el = window.heponlaLiveEditorSelected;
    if (!el) return (status.textContent = "Önce sayfadan bir öğe seçin.");
    const stil = {
      color: document.querySelector("#leMetinRenk").value,
      "background-color": document.querySelector("#leZeminRenk").value,
    };
    el.style.setProperty("color", stil.color, "important");
    el.style.setProperty("background-color", stil["background-color"], "important");
    kayitEkle(el, stil);
    status.textContent = "Renkler önizlemeye uygulandı; Taslak kaydet → Yayınla ile kalıcı olur.";
  };

  document.querySelector("#leBgDosya").addEventListener("change", async (ev) => {
    const dosya = ev.target.files[0];
    const el = window.heponlaLiveEditorSelected;
    if (!dosya) return;
    if (!el) return (status.textContent = "Önce sayfadan bir öğe seçin.");
    const kap = el.closest(".e-con[data-id], section[data-id], div[data-id]") || el;
    const f = new FormData();
    f.append("dosya", dosya);
    const cevap = await fetch(config.mediaUploadEndpoint, {
      method: "POST", credentials: "include", headers: { "x-admin": token() }, body: f,
    }).then((r) => r.json()).catch(() => null);
    if (!(cevap && cevap.ok)) return (status.textContent = (cevap && cevap.error) || "Görsel yüklenemedi");
    const stil = { "background-image": `url('${cevap.url}')`, "background-size": "cover", "background-position": "center" };
    for (const [k, v] of Object.entries(stil)) kap.style.setProperty(k, v, "important");
    kayitEkle(kap, stil);
    status.textContent = "Bölüm arka planı önizlemeye uygulandı; Taslak kaydet → Yayınla ile kalıcı olur.";
    ev.target.value = "";
  });

  // header/footer duzenlemeleri tum sayfalar icin ('*') kaydedilsin
  const applyBtn = document.querySelector("#leApply");
  if (applyBtn) {
    const orijinal = applyBtn.onclick;
    applyBtn.onclick = (e) => {
      if (orijinal) orijinal.call(applyBtn, e);
      const el = window.heponlaLiveEditorSelected;
      const d = window.heponlaLiveEditorChanges || [];
      const son = d[d.length - 1];
      if (el && son && el.closest("header, footer")) son.page = "*";
    };
  }

  // ==================== KUTUPHANE ====================
  // Marka fontlari (sitede yuklu), renk paleti ve buton stil on-tanimlari.
  // Secimler style kaydi olarak kaydedilir; Taslak kaydet -> Yayinla ile kalici.
  const FONTLAR = [
    ["", "Yazı tipi seç…"],
    ["'Instrument Sans', sans-serif", "Instrument Sans (marka)"],
    ["'IBM Plex Sans', sans-serif", "IBM Plex Sans (marka)"],
    ["Georgia, 'Times New Roman', serif", "Georgia (serif)"],
    ["Arial, Helvetica, sans-serif", "Arial"],
  ];
  const PALET = ["#30B6E4", "#1883A8", "#1DB586", "#13263D", "#111827", "#FAF9F7", "#FFFFFF"];
  const BUTON_STILLERI = [
    ["Mavi dolgu", { "background-color": "#30B6E4", "color": "#ffffff", "border-radius": "999px", "border": "none" }],
    ["Koyu", { "background-color": "#111827", "color": "#ffffff", "border-radius": "999px", "border": "none" }],
    ["Yeşil", { "background-color": "#1DB586", "color": "#ffffff", "border-radius": "999px", "border": "none" }],
    ["Çerçeveli", { "background-color": "transparent", "color": "#1883A8", "border": "2px solid #30B6E4", "border-radius": "999px" }],
    ["Beyaz", { "background-color": "#ffffff", "color": "#13263D", "border": "1px solid #DFE8ED", "border-radius": "999px" }],
  ];

  const stilUygula = (el, stil, sayfaKapsami) => {
    for (const [k, v] of Object.entries(stil)) el.style.setProperty(k, v, "important");
    (window.heponlaLiveEditorChanges ||= []).push({
      selector: el === el.ownerDocument.body ? "body" : seciciUret(el),
      tag: el.tagName, text: null, href: null, src: null, style: stil,
      page: sayfaKapsami || (el.closest("header, footer") ? "*" : (document.querySelector("#lePage")?.value || "/")),
    });
    status.textContent = "Kütüphane stili önizlemeye uygulandı; Taslak kaydet → Yayınla ile kalıcı olur.";
  };

  fields.insertAdjacentHTML("beforeend", `
    <div class="le-field" style="border-top:1px solid #dfe9ee;padding-top:12px"><label>KÜTÜPHANE — YAZI TİPİ</label>
      <select id="leFontSec" style="width:100%;padding:8px;border:1px solid #dfe9ee;border-radius:8px;font-family:inherit;font-size:12px">
        ${FONTLAR.map(([v, ad]) => `<option value="${v}">${ad}</option>`).join("")}
      </select>
      <div style="display:flex;gap:6px;margin-top:7px">
        <button id="leFontOge" type="button" style="flex:1;padding:7px;border:1px solid #dfe9ee;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;font-size:11px">Seçili öğeye</button>
        <button id="leFontSayfa" type="button" style="flex:1;padding:7px;border:1px solid #dfe9ee;border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;font-size:11px">Tüm siteye</button>
      </div></div>
    <div class="le-field"><label>KÜTÜPHANE — RENK PALETİ</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${PALET.map((r) => `<button type="button" data-palet="${r}" title="${r}" style="width:26px;height:26px;border-radius:8px;border:1px solid #dfe9ee;background:${r};cursor:pointer"></button>`).join("")}
      </div>
      <p style="font-size:10px;color:#708191;margin:5px 0 0">Tıkla: zemin rengi kutusuna kopyalanır (Shift+tıkla: metin rengi).</p></div>
    <div class="le-field"><label>KÜTÜPHANE — BUTON STİLLERİ</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${BUTON_STILLERI.map(([ad, s], i) => `<button type="button" data-buton-stil="${i}" style="padding:7px 12px;font-size:11px;font-family:inherit;cursor:pointer;background:${s["background-color"]};color:${s.color};border:${s.border === "none" ? "1px solid transparent" : s.border};border-radius:999px">${ad}</button>`).join("")}
      </div>
      <p style="font-size:10px;color:#708191;margin:5px 0 0">Önce sayfadan butonu seç, sonra stile tıkla.</p></div>`);

  document.getElementById("leFontOge").onclick = () => {
    const font = document.getElementById("leFontSec").value;
    const el = window.heponlaLiveEditorSelected;
    if (!font) return (status.textContent = "Önce listeden yazı tipi seç.");
    if (!el) return (status.textContent = "Önce sayfadan bir öğe seç.");
    stilUygula(el, { "font-family": font });
  };
  document.getElementById("leFontSayfa").onclick = () => {
    const font = document.getElementById("leFontSec").value;
    if (!font) return (status.textContent = "Önce listeden yazı tipi seç.");
    const gövde = document.querySelector("#leFrame")?.contentDocument?.body;
    if (!gövde) return;
    stilUygula(gövde, { "font-family": font }, "*");
    status.textContent = "Yazı tipi tüm site için kuyruğa alındı; Taslak kaydet → Yayınla.";
  };
  document.querySelectorAll("[data-palet]").forEach((b) => {
    b.addEventListener("click", (e) => {
      const hedef = e.shiftKey ? "#leMetinRenk" : "#leZeminRenk";
      const kutu = document.querySelector(hedef);
      if (kutu) kutu.value = b.dataset.palet === "#FFFFFF" ? "#ffffff" : b.dataset.palet;
      status.textContent = (e.shiftKey ? "Metin" : "Zemin") + " rengi seçildi: " + b.dataset.palet + " — 'Renkleri uygula' ile kullan.";
    });
  });
  document.querySelectorAll("[data-buton-stil]").forEach((b) => {
    b.addEventListener("click", () => {
      const el = window.heponlaLiveEditorSelected;
      if (!el) return (status.textContent = "Önce sayfadan bir buton seç.");
      const hedefEl = el.closest("a, button") || el;
      stilUygula(hedefEl, BUTON_STILLERI[Number(b.dataset.butonStil)][1]);
    });
  });
});
