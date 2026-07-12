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

    // Sayfa editoru: gercek duzenleme Canli Site Editorunde (kisayol)
    const gorselV = document.querySelector('[data-se-view="visual"]');
    if (gorselV) {
      gorselV.innerHTML = `
        <article class="se-card"><div class="se-card-head"><b>Sayfa içeriği</b><span>Başlık, açıklama, buton metni/rengi, görseller — gerçek sayfada tıkla-düzenle</span></div>
          <div class="se-inspector" style="padding:16px">
            <div class="se-field"><label>SAYFA</label><select class="ic-sayfa-sec">${SAYFALAR.map(([ad, yol]) => `<option value="${yol}">${ad}</option>`).join("")}</select></div>
            <button class="se-btn primary ic-editor-ac" style="margin-top:10px">Canlı Editörde Aç →</button>
          </div></article>`;
      gorselV.querySelector(".ic-editor-ac").addEventListener("click", () => {
        window.open("/icerik/editor/#" + encodeURIComponent(gorselV.querySelector(".ic-sayfa-sec").value), "_blank");
      });
    }

    // ---- MENU ve FOOTER: sitedeki gercek ogeleri panelde dogrudan duzenle ----
    // Ana sayfanin HTML'i cozumlenir; her oge icin kararli (data-id tabanli)
    // secici uretilir; kaydet -> '*' sayfasina CMS kaydi -> tum sitede gecerli.
    const seciciUret = (el) => {
      const t = el.tagName.toLowerCase();
      const w = el.closest("[data-id]");
      if (!w) return null;
      const ayni = [...w.querySelectorAll(t)];
      const n = ayni.indexOf(el);
      return `[data-id="${w.getAttribute("data-id")}"] ${t}@${n < 0 ? 0 : n}`;
    };

    async function siteyiCozumle() {
      const html = await fetch("/", { cache: "no-store" }).then((r) => r.text());
      return new DOMParser().parseFromString(html, "text/html");
    }

    function duzenleyiciKur(gorunum, baslik, aciklama, satirlar, kaydetVeYayinla) {
      const v = document.querySelector(`[data-se-view="${gorunum}"]`);
      if (!v) return;
      v.innerHTML = `
        <article class="se-card"><div class="se-card-head"><b>${baslik}</b><span>${aciklama}</span></div>
          <div style="padding:16px">
            ${satirlar.map((s, i) => `
              <div class="se-field" style="margin-bottom:12px"><label>${esc(s.etiket)}</label>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <input data-satir="${i}" data-alan="metin" value="${esc(s.metin)}" style="flex:2;min-width:180px">
                  ${s.href != null ? `<input data-satir="${i}" data-alan="href" value="${esc(s.href)}" style="flex:1;min-width:140px" placeholder="bağlantı">` : ""}
                </div></div>`).join("")}
            <button class="se-btn primary" data-kaydet style="margin-top:6px">Kaydet ve yayınla</button>
            <span data-durum style="margin-left:10px;font-size:12.5px;color:#1DB586"></span>
            <p style="font-size:12px;color:#6F7E90;margin-top:10px">Değişiklikler tüm sayfalara uygulanır. Görsel/renk düzenlemeleri için <a href="/icerik/editor/" target="_blank">Canlı Editörü</a> kullanabilirsin.</p>
          </div></article>`;
      v.querySelector("[data-kaydet]").addEventListener("click", async () => {
        const durum = v.querySelector("[data-durum]");
        durum.textContent = "Kaydediliyor…";
        const degisiklikler = [];
        satirlar.forEach((s, i) => {
          const metin = v.querySelector(`[data-satir="${i}"][data-alan="metin"]`).value.trim();
          const hrefEl = v.querySelector(`[data-satir="${i}"][data-alan="href"]`);
          if (metin && metin !== s.metin) {
            degisiklikler.push({ selector: s.metinSecici, tag: s.metinTag, text: metin, href: null, src: null });
          }
          if (hrefEl && s.hrefSecici && hrefEl.value.trim() && hrefEl.value.trim() !== s.href) {
            degisiklikler.push({ selector: s.hrefSecici, tag: "A", text: null, href: hrefEl.value.trim(), src: null });
          }
        });
        if (!degisiklikler.length) { durum.textContent = "Değişiklik yok"; return; }
        const sonuc = await kaydetVeYayinla(degisiklikler);
        durum.textContent = sonuc ? `✓ ${degisiklikler.length} değişiklik yayında` : "Kaydedilemedi";
        setTimeout(() => { durum.textContent = ""; }, 3000);
      });
    }

    async function yayinla(degisiklikler) {
      const cevap = await api2("/api/cms/publish", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "*", changes: degisiklikler }),
      });
      return cevap && cevap.ok;
    }

    // ---- TASARIM KARTLARI: menu ve footer gorunumu (tum sayfalara uygulanir) ----
    // Kayitlar genel CSS secicileriyle tutulur; cms.js tum eslesmelere uygular.
    const stilKaydi = (selector, style) => ({ selector, tag: "DIV", text: null, href: null, src: null, style });

    // menu zemini iki katmanlidir: dis konteyner + icindeki beyaz katman (8737862)
    const menuZemin = (renk) => [
      stilKaydi("header > .e-con", { "background-color": renk }),
      stilKaydi('header [class*="elementor-element-8737862"]', { "background-color": renk }),
    ];
    const MENU_TEMALARI = {
      "Beyaz (varsayılan)": [...menuZemin("#ffffff"), stilKaydi("header .e-n-menu-title-text", { color: "#111827" })],
      "Koyu": [...menuZemin("#111827"), stilKaydi("header .e-n-menu-title-text", { color: "#ffffff" })],
      "Hepon Mavi": [...menuZemin("#1883A8"), stilKaydi("header .e-n-menu-title-text", { color: "#ffffff" })],
    };
    const FOOTER_TEMALARI = {
      "Siyah (varsayılan)": [
        stilKaydi("footer, footer .vamtam-has-theme-cp", { "background-color": "#000000" }),
        stilKaydi("footer p, footer li, footer span, footer a", { color: "#9aa4b2" }),
        stilKaydi("footer h2, footer h3, footer h6", { color: "#ffffff" }),
      ],
      "Lacivert": [
        stilKaydi("footer, footer .vamtam-has-theme-cp", { "background-color": "#13263D" }),
        stilKaydi("footer p, footer li, footer span, footer a", { color: "#B9C6DD" }),
        stilKaydi("footer h2, footer h3, footer h6", { color: "#ffffff" }),
      ],
      "Açık": [
        stilKaydi("footer, footer .vamtam-has-theme-cp", { "background-color": "#FAF9F7" }),
        stilKaydi("footer p, footer li, footer span, footer a", { color: "#4A5568" }),
        stilKaydi("footer h2, footer h3, footer h6", { color: "#13263D" }),
      ],
    };

    function tasarimKarti(gorunum, baslik, temalar, ozel) {
      const v = document.querySelector(`[data-se-view="${gorunum}"]`);
      if (!v) return;
      const kart = document.createElement("article");
      kart.className = "se-card";
      kart.innerHTML = `
        <div class="se-card-head"><b>${baslik}</b><span>Hazır tema seç veya kendi renklerini uygula — tüm sayfalarda geçerli</span></div>
        <div style="padding:16px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
            ${Object.keys(temalar).map((ad) => `<button type="button" data-tema="${esc(ad)}" class="se-btn" style="font-size:12.5px">${esc(ad)}</button>`).join("")}
          </div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <label style="font-size:12px;color:#6F7E90">Arka plan <input type="color" data-ozel-zemin value="${ozel.zemin}" style="width:40px;height:30px;border:1px solid #DFE8ED;border-radius:8px;padding:2px;vertical-align:middle"></label>
            <label style="font-size:12px;color:#6F7E90">Yazı rengi <input type="color" data-ozel-metin value="${ozel.metin}" style="width:40px;height:30px;border:1px solid #DFE8ED;border-radius:8px;padding:2px;vertical-align:middle"></label>
            <button type="button" data-ozel-uygula class="se-btn primary" style="font-size:12.5px">Renkleri uygula ve yayınla</button>
          </div>
          <span data-tasarim-durum style="display:block;margin-top:10px;font-size:12.5px;color:#1DB586"></span>
        </div>`;
      v.appendChild(kart);
      const durum = kart.querySelector("[data-tasarim-durum]");
      const gonder = async (kayitlar) => {
        durum.textContent = "Yayınlanıyor…";
        const tamam = await yayinla(kayitlar);
        durum.textContent = tamam ? "✓ Tasarım tüm sayfalarda yayında" : "Yayınlanamadı";
        setTimeout(() => { durum.textContent = ""; }, 3000);
      };
      kart.querySelectorAll("[data-tema]").forEach((b) => {
        b.addEventListener("click", () => gonder(temalar[b.dataset.tema]));
      });
      kart.querySelector("[data-ozel-uygula]").addEventListener("click", () => {
        const zemin = kart.querySelector("[data-ozel-zemin]").value;
        const metin = kart.querySelector("[data-ozel-metin]").value;
        gonder(ozel.kayitlar(zemin, metin));
      });
    }

    siteyiCozumle().then((doc) => {
      const header = doc.querySelector("header");
      const footer = doc.querySelector("footer");

      // MENU satirlari: ust menu basliklari + urun menusu + Uye Ol butonu
      const menuSatirlari = [];
      if (header) {
        header.querySelectorAll(".e-n-menu-title-text").forEach((span) => {
          const metin = span.textContent.trim();
          if (!metin || menuSatirlari.some((s) => s.metin === metin && s.tur === "ust")) return;
          const a = span.closest("a");
          menuSatirlari.push({
            tur: "ust", etiket: "ÜST MENÜ: " + metin, metin,
            metinSecici: seciciUret(span), metinTag: "SPAN",
            href: a ? a.getAttribute("href") : null,
            hrefSecici: a ? seciciUret(a) : null,
          });
        });
        header.querySelectorAll(".elementor-icon-box-title a").forEach((a) => {
          const metin = a.textContent.trim();
          if (!metin || menuSatirlari.some((s) => s.metin === metin)) return;
          menuSatirlari.push({
            tur: "urun", etiket: "ÜRÜN MENÜSÜ: " + metin, metin,
            metinSecici: seciciUret(a), metinTag: "A",
            href: a.getAttribute("href"), hrefSecici: seciciUret(a),
          });
        });
        const uyeol = [...header.querySelectorAll(".elementor-button-text")]
          .find((s) => s.textContent.includes("Üye"));
        if (uyeol) {
          const a = uyeol.closest("a");
          menuSatirlari.push({
            tur: "buton", etiket: "BUTON: Üye Ol/Giriş Yap", metin: uyeol.textContent.trim(),
            metinSecici: seciciUret(uyeol), metinTag: "SPAN",
            href: a ? a.getAttribute("href") : null,
            hrefSecici: a ? seciciUret(a) : null,
          });
        }
      }
      duzenleyiciKur("menus", "Menü düzenleme",
        "Üst menü, ürün menüsü ve üyelik butonu — metin ve bağlantılar", menuSatirlari, yayinla);

      // FOOTER satirlari: telefon, e-posta ve metin bloklari
      const footerSatirlari = [];
      if (footer) {
        footer.querySelectorAll('a[href^="tel:"]').forEach((a) => {
          footerSatirlari.push({ etiket: "TELEFON", metin: a.textContent.trim(),
            metinSecici: seciciUret(a), metinTag: "A",
            href: a.getAttribute("href"), hrefSecici: seciciUret(a) });
        });
        footer.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
          footerSatirlari.push({ etiket: "E-POSTA", metin: a.textContent.trim(),
            metinSecici: seciciUret(a), metinTag: "A",
            href: a.getAttribute("href"), hrefSecici: seciciUret(a) });
        });
        [...footer.querySelectorAll("p")].slice(0, 4).forEach((p, i) => {
          const metin = p.textContent.trim();
          if (!metin || metin.length > 220) return;
          footerSatirlari.push({ etiket: "METİN " + (i + 1), metin,
            metinSecici: seciciUret(p), metinTag: "P", href: null, hrefSecici: null });
        });
      }
      duzenleyiciKur("footer", "Footer düzenleme",
        "İletişim bilgileri ve footer metinleri — tüm sayfalarda geçerli", footerSatirlari, yayinla);

      // tasarim kartlari (metin duzenleyicilerin altina eklenir)
      tasarimKarti("menus", "Menü tasarımı", MENU_TEMALARI, {
        zemin: "#ffffff", metin: "#111827",
        kayitlar: (zemin, metin) => [
          ...menuZemin(zemin),
          stilKaydi("header .e-n-menu-title-text", { color: metin }),
        ],
      });
      tasarimKarti("footer", "Footer tasarımı", FOOTER_TEMALARI, {
        zemin: "#000000", metin: "#9aa4b2",
        kayitlar: (zemin, metin) => [
          stilKaydi("footer, footer .vamtam-has-theme-cp", { "background-color": zemin }),
          stilKaydi("footer p, footer li, footer span, footer a", { color: metin }),
        ],
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
