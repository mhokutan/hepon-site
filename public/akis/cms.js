// Canli Site Editoru - yayin uygulayicisi.
// Sayfa acilirken /api/cms/icerik'ten bu sayfanin YAYINLANMIS degisikliklerini
// ceker ve uygular. Boylece editorden yapilan metin/baglanti/gorsel
// degisiklikleri, tasarim aynasi yenilense bile kalici olur.
(async () => {
  "use strict";

  let liste = [];
  try {
    liste = await fetch("/api/cms/icerik?sayfa=" + encodeURIComponent(location.pathname))
      .then((r) => r.json());
  } catch (e) { return; }
  if (!Array.isArray(liste) || !liste.length) return;

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
    try { return document.querySelector(secici); } catch (e) { return null; }
  }

  for (const d of liste) {
    const el = bul(d.secici);
    if (!el || !d.yayin) continue;
    if (d.etiket === "IMG") {
      if (d.yayin.src) { el.removeAttribute("srcset"); el.src = d.yayin.src; }
    } else {
      if (d.yayin.text != null && d.yayin.text !== "") el.textContent = d.yayin.text;
      if (d.etiket === "A" && d.yayin.href) el.setAttribute("href", d.yayin.href);
    }
  }
})();
