// Canli Site Editoru - yayin uygulayicisi.
// Sayfa acilirken bu sayfanin VE '*' (tum sayfalar: header/footer/menu)
// yayinlanmis degisikliklerini ceker, uygular. HTML'e yazilmadigi icin
// tasarim aynasi yenilense de duzenlemeler kalicidir.
(async () => {
  "use strict";

  let liste = [];
  try {
    const [sayfa, genel] = await Promise.all([
      fetch("/api/cms/icerik?sayfa=" + encodeURIComponent(location.pathname)).then((r) => r.json()),
      fetch("/api/cms/icerik?sayfa=*").then((r) => r.json()),
    ]);
    liste = [...(Array.isArray(genel) ? genel : []), ...(Array.isArray(sayfa) ? sayfa : [])];
  } catch (e) { return; }
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

  for (const d of liste) {
    if (!d.yayin) continue;

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
