// Canli Site Editoru - yayin uygulayicisi.
// Sayfa acilirken bu sayfanin VE '*' (tum sayfalar: header/footer/menu)
// yayinlanmis degisikliklerini ceker, uygular. HTML'e yazilmadigi icin
// tasarim aynasi yenilense de duzenlemeler kalicidir.
(async () => {
  "use strict";

  let liste = [], bilesenler = [];
  try {
    const slug = location.pathname === "/" ? "home" : location.pathname.replace(/\//g, "");
    const [sayfa, genel, sayfaVerisi] = await Promise.all([
      fetch("/api/cms/icerik?sayfa=" + encodeURIComponent(location.pathname)).then((r) => r.json()),
      fetch("/api/cms/icerik?sayfa=*").then((r) => r.json()),
      fetch("/api/cms/pages/" + slug).then((r) => r.json()).catch(() => null),
    ]);
    liste = [...(Array.isArray(genel) ? genel : []), ...(Array.isArray(sayfa) ? sayfa : [])];
    bilesenler = (sayfaVerisi && Array.isArray(sayfaVerisi.bilesenler)) ? sayfaVerisi.bilesenler : [];
  } catch (e) { return; }

  // ---- bilesen modeli: alanlar / gorunurluk / siralama ----
  for (const b of bilesenler) {
    const alan = b.alanlar || {};
    const hedef = (ek) => document.querySelector(`[data-hepon-edit="${b.anahtar}.${ek}"]`);
    const baslik = hedef("title");
    if (baslik && alan.title) baslik.textContent = alan.title;
    const aciklama = hedef("description");
    if (aciklama && alan.description) aciklama.textContent = alan.description;
    const gorsel = hedef("image");
    if (gorsel && alan.image) { gorsel.removeAttribute("srcset"); gorsel.src = alan.image; }
    const buton = hedef("cta");
    if (buton) {
      if (alan.button_text) {
        const metin = buton.querySelector(".elementor-button-text") || buton;
        metin.textContent = alan.button_text;
      }
      if (alan.button_url) buton.setAttribute("href", alan.button_url);
    }
    const kok = document.querySelector(`[data-hepon-component="${b.anahtar}"]`);
    if (kok) {
      if (b.gorunur === false) kok.style.setProperty("display", "none", "important");
      if (b.sira != null) kok.style.setProperty("order", String(b.sira));
    }
  }

  if (!liste.length) return;

  function bul(secici) {
    if (secici.startsWith("data-hepon-edit: ")) {
      return document.querySelector('[data-hepon-edit="' + secici.slice(17) + '"]');
    }
    // kararli bicim: [data-id="x"] tag@n
    const m = secici.match(/^(\[data-id="[^"]+"\])\s+([a-z0-9]+)@(\d+)$/);
    if (m) {
      const kap = document.querySelector(m[1]);
      if (!kap) return null;
      return [...kap.querySelectorAll(m[2])][Number(m[3])] || null;
    }
    // dogrudan kap secimi: [data-id="x"]
    try { return document.querySelector(secici); } catch (e) { return null; }
  }

  // anahtar veya seciciyle hedef bul (aksiyonlar icin bilesen koku tercih edilir)
  function kokBul(secici) {
    const anahtar = secici.startsWith("data-hepon-edit: ") ? secici.slice(17) : secici;
    return document.querySelector(`[data-hepon-component="${anahtar}"]`) ||
      document.querySelector(`[data-hepon-edit="${anahtar}"]`) ||
      (document.querySelector(`[data-hepon-edit^="${anahtar}."]`) || {}).closest?.("[data-id]") ||
      bul(secici);
  }

  for (const d of liste) {
    if (!d.yayin) continue;

    // editorun kopyala/sil aksiyonlari
    if (d.yayin.action) {
      const kok = kokBul(d.secici);
      if (!kok) continue;
      if (d.yayin.action === "delete") {
        kok.style.setProperty("display", "none", "important");
      } else if (d.yayin.action === "duplicate" && !kok.dataset.heponKopyalandi) {
        kok.dataset.heponKopyalandi = "1";
        const kopya = kok.cloneNode(true);
        kopya.removeAttribute("data-hepon-live-selected");
        // kopyadaki anahtarlari temizle ki sonraki duzenlemeler karismasin
        kopya.querySelectorAll("[data-hepon-edit]").forEach((x) => x.removeAttribute("data-hepon-edit"));
        kopya.removeAttribute("data-hepon-component");
        kok.after(kopya);
      }
      continue;
    }

    // sayfa SEO kaydi
    if (d.secici === "__seo__") {
      const s = d.yayin.style || {};
      if (s.title) document.title = s.title;
      if (s.description) {
        let m = document.querySelector('meta[name="description"]');
        if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
        m.setAttribute("content", s.description);
      }
      continue;
    }

    const el = bul(d.secici);
    if (!el) continue;
    if (d.etiket === "IMG") {
      if (d.yayin.src) { el.removeAttribute("srcset"); el.src = d.yayin.src; }
    } else {
      if (d.yayin.text != null && d.yayin.text !== "") el.textContent = d.yayin.text;
      if (d.etiket === "A" && d.yayin.href) el.setAttribute("href", d.yayin.href);
    }
    // stil degisiklikleri (buton rengi, arka plan rengi/gorseli vb.)
    if (d.yayin.style && typeof d.yayin.style === "object") {
      for (const [ozellik, deger] of Object.entries(d.yayin.style)) {
        if (deger) el.style.setProperty(ozellik, String(deger), "important");
      }
    }
  }
})();
