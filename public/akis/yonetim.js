// Yonetim paneli: /api/admin uclarina baglanir. Giris perdesi olmadan veri gorunmez;
// tum veri uclari x-admin token'i ister (token sessionStorage'da tutulur).
(() => {
  "use strict";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const URUN = { dask: "DASK", travel: "Seyahat Sağlık", trafik: "Trafik",
                 kasko: "Kasko", imm: "İMM", tss: "Tamamlayıcı Sağlık" };
  const DURUM = { received: "Alındı", quote_shown: "Teklif hazır", completed: "Tamamlandı", cancelled: "İptal" };
  const tarih = (t) => t ? new Date(t).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : "-";

  // --- giris perdesi ---
  const stil = document.createElement("style");
  stil.textContent = `
    .yp-perde{position:fixed;inset:0;z-index:999999;background:#0B1220;display:flex;align-items:center;justify-content:center;padding:24px;font-family:inherit}
    .yp-kutu{width:100%;max-width:380px;background:#fff;border-radius:20px;padding:30px;box-shadow:0 30px 80px rgba(0,0,0,.5)}
    .yp-kutu h2{margin:0 0 4px;color:#13263D;font-size:21px}
    .yp-kutu p{margin:0 0 18px;color:#6F7E90;font-size:13.5px}
    .yp-kutu label{display:block;font-size:12.5px;font-weight:600;color:#6F7E90;margin:12px 0 5px}
    .yp-kutu input{width:100%;box-sizing:border-box;padding:11px 13px;border:1.5px solid #DFE8ED;border-radius:12px;font-size:15px;font-family:inherit}
    .yp-kutu input:focus{outline:none;border-color:#30B6E4;box-shadow:0 0 0 4px rgba(48,182,228,.15)}
    .yp-hata{display:none;background:#FDECEC;color:#D84C4C;border-radius:10px;padding:9px 12px;font-size:13px;margin-top:12px}
    .yp-hata.goster{display:block}
    .yp-btn{width:100%;margin-top:16px;border:none;border-radius:999px;padding:13px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;background:#30B6E4;color:#fff}
    .yp-btn:hover{background:#1883A8}
    .yp-form{margin:0 0 18px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .yp-form input,.yp-form select{padding:9px 11px;border:1.5px solid #DFE8ED;border-radius:10px;font-size:13.5px;font-family:inherit}
    .yp-form .tam{grid-column:1/-1}
    .yp-form button{grid-column:1/-1;border:none;border-radius:999px;padding:10px;font-weight:700;font-family:inherit;cursor:pointer;background:#30B6E4;color:#fff}
    .yp-kamp{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #EDF3F6;font-size:14px}
    .yp-kamp b{color:#13263D}.yp-kamp span{color:#6F7E90;font-size:12.5px;display:block}
    .yp-kamp button{border:1px solid #DFE8ED;background:#fff;border-radius:999px;padding:6px 14px;font-size:12.5px;font-family:inherit;cursor:pointer}
    .yp-pasif{opacity:.5}`;
  document.head.appendChild(stil);

  const perde = document.createElement("div");
  perde.className = "yp-perde";
  perde.innerHTML = `<div class="yp-kutu">
    <h2>Heponla Yönetim</h2>
    <p>Bu alan yalnızca yetkili yönetici içindir.</p>
    <label>Kullanıcı adı</label><input id="ypKullanici" autocomplete="username">
    <label>Şifre</label><input id="ypSifre" type="password" autocomplete="current-password">
    <div class="yp-hata" id="ypHata"></div>
    <button class="yp-btn" id="ypGiris" type="button">Giriş yap</button>
  </div>`;
  document.body.appendChild(perde);

  let token = sessionStorage.getItem("hepon_admin") || "";

  const api = async (yol, secenek = {}) => {
    const r = await fetch("/api/admin" + yol, {
      ...secenek,
      headers: { "Content-Type": "application/json", "x-admin": token, ...(secenek.headers || {}) },
    });
    return r.json();
  };

  async function girisDene() {
    const hata = document.getElementById("ypHata");
    hata.classList.remove("goster");
    const cevap = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: document.getElementById("ypKullanici").value.trim(),
        password: document.getElementById("ypSifre").value,
      }),
    }).then((r) => r.json()).catch(() => null);
    if (!cevap || cevap.error || !cevap.token) {
      hata.textContent = (cevap && cevap.error) || "Giriş yapılamadı.";
      hata.classList.add("goster");
      return;
    }
    token = cevap.token;
    sessionStorage.setItem("hepon_admin", token);
    perde.remove();
    yukle();
  }
  perde.querySelector("#ypGiris").addEventListener("click", girisDene);
  perde.addEventListener("keydown", (e) => { if (e.key === "Enter") girisDene(); });

  function rozetAyarla(sekme, deger) {
    const b = document.querySelector(`[data-admin-tab="${sekme}"] .adm-badge`);
    if (b) b.textContent = String(deger);
  }

  /** PDF uclari x-admin basligi istedigi icin duz link yerine blob indirme */
  async function pdfAc(yol) {
    const r = await fetch("/api/admin" + yol, { headers: { "x-admin": token } });
    if (!r.ok) return alert("PDF alınamadı");
    const url = URL.createObjectURL(await r.blob());
    window.open(url, "_blank");
  }

  const URUN_SECENEK = '<option value="dask">DASK</option><option value="travel">Seyahat Sağlık</option>' +
    '<option value="trafik">Trafik</option><option value="kasko">Kasko</option>' +
    '<option value="imm">İMM</option><option value="tss">Tamamlayıcı Sağlık</option>';

  async function policeleriCiz() {
    const kap = document.querySelector('[data-admin-view="policies"] .adm-card');
    if (!kap) return;
    const liste = await api("/policeler");
    if (!Array.isArray(liste)) return;
    kap.innerHTML = `<h2 style="margin-top:0">Poliçeler</h2>
      <form class="yp-form" id="ypPoliceForm">
        <input name="nationalId" placeholder="Müşteri TCKN (kayıtlı olmalı)" required>
        <input name="policyNo" placeholder="Poliçe no (örn. HEP-2026-0002)" required>
        <input name="companyName" placeholder="Sigorta şirketi" required>
        <select name="productType">${URUN_SECENEK}</select>
        <input name="soldPremium" type="number" step="0.01" placeholder="Prim (TL)">
        <input name="requestId" type="number" placeholder="İlişkili talep no (ops.)">
        <input name="startDate" type="date" title="Başlangıç"><input name="endDate" type="date" title="Bitiş">
        <button type="submit">+ Poliçe kaydet</button>
      </form>
      <span id="ypPoliceDurum" style="font-size:12.5px;color:#1DB586"></span>
      <div class="table-wrap" style="margin-top:12px"><table class="adm-table"><thead>
        <tr><th>POLİÇE NO</th><th>MÜŞTERİ</th><th>ÜRÜN</th><th>ŞİRKET</th><th>PRİM</th><th>BİTİŞ</th><th></th></tr></thead><tbody>` +
      (liste.map((p) => `<tr><td><b>${esc(p.policy_no)}</b></td><td>${esc(p.full_name || p.phone || "-")}</td>` +
        `<td>${esc(URUN[p.product_type] || p.product_type)}</td><td>${esc(p.company_name)}</td>` +
        `<td>${p.sold_premium ? Number(p.sold_premium).toLocaleString("tr-TR") + " TL" : "-"}</td>` +
        `<td>${tarih(p.end_date)}</td>` +
        `<td><button data-police-pdf="${esc(p.policy_no)}" style="border:1px solid #DFE8ED;background:#fff;border-radius:999px;padding:4px 12px;font-size:12px;cursor:pointer;font-family:inherit">PDF</button></td></tr>`).join("") ||
        '<tr><td colspan="7">Henüz poliçe yok. Yukarıdaki formla ilk poliçeyi girebilirsin.</td></tr>') +
      "</tbody></table></div>";
    document.getElementById("ypPoliceForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const cevap = await api("/policeler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nationalId: f.get("nationalId"), policyNo: f.get("policyNo"),
          companyName: f.get("companyName"), productType: f.get("productType"),
          soldPremium: f.get("soldPremium") ? Number(f.get("soldPremium")) : null,
          requestId: f.get("requestId") ? Number(f.get("requestId")) : null,
          startDate: f.get("startDate") || null, endDate: f.get("endDate") || null,
        }),
      });
      document.getElementById("ypPoliceDurum").textContent =
        cevap.ok ? "✓ Poliçe kaydedildi" : (cevap.error || "Kaydedilemedi");
      if (cevap.ok) { e.target.reset(); policeleriCiz(); }
    });
    kap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-police-pdf]");
      if (b) pdfAc("/police/" + encodeURIComponent(b.dataset.policePdf) + "/pdf");
    });
  }

  async function kampanyalariCiz() {
    const liste = await api("/kampanyalar");
    const kap = document.getElementById("ypKampListe");
    if (!kap || !Array.isArray(liste)) return;
    kap.innerHTML = liste.map((k) => `
      <div class="yp-kamp ${k.active ? "" : "yp-pasif"}">
        <div><b>${esc(k.title)}</b>${k.discount_text ? " · " + esc(k.discount_text) : ""}
          <span>${esc(k.description || "")} ${k.product_code ? "· Ürün: " + esc(URUN[k.product_code] || k.product_code) : ""}
          · ${tarih(k.created_at)} · ${k.active ? "AKTİF" : "pasif"}</span></div>
        <button data-kamp-id="${k.id}" data-kamp-aktif="${k.active}">${k.active ? "Pasifleştir" : "Aktifleştir"}</button>
      </div>`).join("") || "<p>Henüz kampanya yok.</p>";
    rozetAyarla("campaigns", liste.filter((k) => k.active).length);
  }

  async function yukle() {
    const ozet = await api("/ozet");
    if (ozet.error) { sessionStorage.removeItem("hepon_admin"); document.body.appendChild(perde); return; }
    // Not: gorsel/icerik yonetimi /icerik/ panelindedir; burasi sirket yonetimi
    // (raporlar, musteriler, talepler, kampanyalar) icin ayrilmistir.

    // kenar cubugu rozetleri
    rozetAyarla("customers", ozet.customerCount);
    rozetAyarla("quotes", ozet.requestCount);
    ["renewals", "cancellations", "support", "policies"].forEach((s) => rozetAyarla(s, 0));

    // KPI kartlari
    const kpiler = document.querySelectorAll(".adm-kpi");
    const kpiVeri = [
      ["Toplam müşteri", ozet.customerCount, "Kayıtlı müşteri sayısı"],
      ["Teklif talepleri", ozet.requestCount, "Toplam gelen talep"],
      ["Aktif kampanyalar", ozet.activeCampaignCount, "Yayındaki kampanya"],
      ["Aktif poliçeler", 0, "Poliçe satışı henüz başlamadı"],
    ];
    kpiler.forEach((k, i) => {
      if (!kpiVeri[i]) return;
      const ust = k.querySelector(".adm-kpi-top span");
      const sayi = k.querySelector("b");
      const alt = k.querySelector("b + span");
      if (ust) ust.textContent = kpiVeri[i][0];
      if (sayi) sayi.textContent = String(kpiVeri[i][1]);
      if (alt) alt.textContent = kpiVeri[i][2];
    });

    // uyari bandi
    const uyari = document.querySelector(".adm-alert span");
    if (uyari) uyari.innerHTML = `<b>${ozet.requestCount} teklif talebi</b> listede. Müşterilere hızlı dönüş için sırayı kontrol edin.`;

    // genel bakis tablosu: son talepler
    const satir = (t) => `<tr><td><b>${esc(t.full_name || t.phone || "-")}</b></td>` +
      `<td>${esc(URUN[t.product_type] || t.product_type)}</td>` +
      `<td>${esc(DURUM[t.status] || t.status)}</td><td>${tarih(t.created_at)}</td></tr>`;
    const tbody = document.querySelector(".adm-table tbody");
    if (tbody) tbody.innerHTML = (ozet.lastRequests || []).map(satir).join("") ||
      '<tr><td colspan="4">Henüz talep yok.</td></tr>';

    rozetAyarla("policies", ozet.policyCount ?? 0);
    policeleriCiz();

    // musteriler goruntusu
    const musteriler = await api("/musteriler");
    const mKap = document.querySelector('[data-admin-view="customers"] .adm-card');
    if (mKap && Array.isArray(musteriler)) {
      mKap.innerHTML = `<div class="table-wrap"><table class="adm-table"><thead>
        <tr><th>AD SOYAD</th><th>TCKN</th><th>TELEFON</th><th>E-POSTA</th><th>KAYIT</th></tr></thead><tbody>` +
        (musteriler.map((m) => `<tr><td><b>${esc(m.full_name || "-")}</b></td><td>${esc(m.national_id)}</td>` +
          `<td>${esc(m.phone || "-")}</td><td>${esc(m.email || "-")}</td><td>${tarih(m.created_at)}</td></tr>`).join("") ||
          '<tr><td colspan="5">Kayıtlı müşteri yok.</td></tr>') + "</tbody></table></div>";
    }

    // teklif talepleri: kim tamamlamis (police kesilmis), kim yarim birakmis
    const talepler = await api("/talepler");
    const tKap = document.querySelector('[data-admin-view="quotes"] .adm-card');
    if (tKap && Array.isArray(talepler)) {
      const rozet = (t) => t.tamamlandi
        ? '<span style="background:#E4F7EF;color:#1DB586;border-radius:999px;padding:3px 10px;font-size:11.5px;font-weight:700">✓ Tamamlandı</span>'
        : '<span style="background:#FFF7E6;color:#B7791F;border-radius:999px;padding:3px 10px;font-size:11.5px;font-weight:700">Yarım kaldı</span>';
      tKap.innerHTML = `<div class="table-wrap"><table class="adm-table"><thead>
        <tr><th>NO</th><th>MÜŞTERİ</th><th>İLETİŞİM</th><th>ÜRÜN</th><th>AŞAMA</th><th>SONUÇ</th><th>TARİH</th><th></th></tr></thead><tbody>` +
        (talepler.map((t) => `<tr><td>${t.id}</td><td><b>${esc(t.full_name || "-")}</b></td>` +
          `<td>${esc(t.phone || t.email || "-")}</td><td>${esc(URUN[t.product_type] || t.product_type)}</td>` +
          `<td>${esc(DURUM[t.status] || t.status)}</td><td>${rozet(t)}</td><td>${tarih(t.created_at)}</td>` +
          `<td><button data-talep-pdf="${t.id}" style="border:1px solid #DFE8ED;background:#fff;border-radius:999px;padding:4px 12px;font-size:12px;cursor:pointer;font-family:inherit">PDF</button></td></tr>`).join("") ||
          '<tr><td colspan="8">Henüz talep yok.</td></tr>') + "</tbody></table></div>";
      tKap.addEventListener("click", (e) => {
        const b = e.target.closest("[data-talep-pdf]");
        if (b) pdfAc("/talepler/" + b.dataset.talepPdf + "/pdf");
      });
    }

    // kampanya yonetimi
    const kKap = document.querySelector('[data-admin-view="campaigns"] .adm-card');
    if (kKap) {
      kKap.innerHTML = `<h2 style="margin-top:0">Kampanyalar</h2>
        <form class="yp-form" id="ypKampForm">
          <input class="tam" name="title" placeholder="Kampanya başlığı (zorunlu)" required>
          <input class="tam" name="description" placeholder="Açıklama">
          <select name="productCode"><option value="">Tüm ürünler</option>
            <option value="trafik">Trafik</option><option value="kasko">Kasko</option>
            <option value="dask">DASK</option><option value="travel">Seyahat Sağlık</option>
            <option value="tss">Tamamlayıcı Sağlık</option><option value="imm">İMM</option></select>
          <input name="discountText" placeholder="İndirim metni (örn. %10)">
          <input name="startsAt" type="date" title="Başlangıç"><input name="endsAt" type="date" title="Bitiş">
          <button type="submit">+ Kampanya oluştur</button>
        </form>
        <div id="ypKampListe"></div>`;
      document.getElementById("ypKampForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const cevap = await api("/kampanyalar", {
          method: "POST",
          body: JSON.stringify({
            title: f.get("title"), description: f.get("description"),
            productCode: f.get("productCode") || null, discountText: f.get("discountText") || null,
            startsAt: f.get("startsAt") || null, endsAt: f.get("endsAt") || null,
          }),
        });
        if (cevap.ok) { e.target.reset(); kampanyalariCiz(); }
      });
      kKap.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-kamp-id]");
        if (!b) return;
        await api("/kampanyalar/" + b.dataset.kampId, {
          method: "PATCH",
          body: JSON.stringify({ active: b.dataset.kampAktif !== "true" }),
        });
        kampanyalariCiz();
      });
      kampanyalariCiz();
    }
  }

  // gecerli oturum varsa perdeyi kaldirip yukle
  if (token) {
    api("/ozet").then((o) => {
      if (!o.error) { perde.remove(); yukle(); }
      else sessionStorage.removeItem("hepon_admin");
    });
  }
})();
