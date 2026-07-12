// Gorsel Yoneticisi sayfa scripti.
// 1) Acilista /api/gorseller/harita'yi okur, eslesen <img> src'lerini takas eder.
//    Boylece tasarim aynasi yenilense de gorsel degisiklikleri kalici olur.
// 2) Yonetici, siteye ?duzenle=1 ile girerse gorsellerin ustunde kalem butonu
//    belirir; tikla-sec-yukle ile gorsel aninda degisir (Elementor benzeri).
(async () => {
  "use strict";

  let harita = {};
  try {
    harita = await fetch("/api/gorseller/harita").then((r) => r.json());
  } catch (e) { harita = {}; }

  const yol = (u) => {
    try { return new URL(u, location.origin).pathname; } catch (e) { return u || ""; }
  };

  const uygula = (img) => {
    const orijinal = img.dataset.hOrijinal || yol(img.getAttribute("src"));
    const yeni = harita[orijinal];
    if (yeni && yol(img.getAttribute("src")) !== yeni) {
      img.dataset.hOrijinal = orijinal;
      img.removeAttribute("srcset");
      img.src = yeni;
    }
  };
  document.querySelectorAll("img").forEach(uygula);

  // ---- duzenleme modu ----
  if (!/[?&]duzenle=1/.test(location.search)) return;
  const token = sessionStorage.getItem("hepon_admin");
  if (!token) {
    alert("Görsel düzenleme için önce /yonetim/ sayfasından giriş yapın, sonra bu sayfaya ?duzenle=1 ile dönün.");
    return;
  }

  const stil = document.createElement("style");
  stil.textContent = `
    .h-kalem{position:absolute;z-index:99998;background:#30B6E4;color:#fff;border:none;border-radius:999px;
      width:34px;height:34px;font-size:15px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);font-family:inherit}
    .h-kalem:hover{background:#1883A8}
    .h-serit{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0B1220;color:#fff;
      font:13px/1.4 system-ui;padding:10px 16px;text-align:center}
    .h-serit b{color:#30B6E4}`;
  document.head.appendChild(stil);

  const serit = document.createElement("div");
  serit.className = "h-serit";
  serit.innerHTML = "<b>Görsel düzenleme modu</b> — değiştirmek istediğin görselin sağ üstündeki ✎ düğmesine tıkla. Değişiklik anında yayına girer.";
  document.body.appendChild(serit);

  const secici = document.createElement("input");
  secici.type = "file";
  secici.accept = "image/*";
  secici.hidden = true;
  document.body.appendChild(secici);
  let hedef = null;

  const kalemler = [];
  document.querySelectorAll("img").forEach((img) => {
    const kutu = img.getBoundingClientRect();
    if (kutu.width < 48 || kutu.height < 32) return; // kucuk ikonlari atla
    const kalem = document.createElement("button");
    kalem.className = "h-kalem";
    kalem.type = "button";
    kalem.textContent = "✎";
    kalem.title = "Bu görseli değiştir";
    document.body.appendChild(kalem);
    kalemler.push([kalem, img]);
    kalem.addEventListener("click", () => { hedef = img; secici.click(); });
  });

  function yerlestir() {
    for (const [kalem, img] of kalemler) {
      const b = img.getBoundingClientRect();
      const gorunur = b.width > 0 && b.bottom > 0 && b.top < innerHeight + 2000;
      kalem.style.display = gorunur ? "block" : "none";
      kalem.style.left = (scrollX + b.right - 42) + "px";
      kalem.style.top = (scrollY + b.top + 8) + "px";
    }
  }
  yerlestir();
  addEventListener("scroll", yerlestir, { passive: true });
  addEventListener("resize", yerlestir);
  setInterval(yerlestir, 1200);

  secici.addEventListener("change", async () => {
    const dosya = secici.files[0];
    if (!dosya || !hedef) return;
    const orijinal = hedef.dataset.hOrijinal || yol(hedef.getAttribute("src"));
    const f = new FormData();
    f.append("dosya", dosya);
    f.append("eskiSrc", orijinal);
    f.append("sayfa", location.pathname);
    const cevap = await fetch("/api/admin/gorsel-yukle", {
      method: "POST", headers: { "x-admin": token }, body: f,
    }).then((r) => r.json()).catch(() => null);
    if (cevap && cevap.ok) {
      hedef.dataset.hOrijinal = orijinal;
      hedef.removeAttribute("srcset");
      hedef.src = cevap.url;
      yerlestir();
    } else {
      alert((cevap && cevap.error) || "Yükleme başarısız (10 MB sınırı ve görsel türleri: jpg/png/webp/gif/svg)");
    }
    secici.value = "";
  });
})();
