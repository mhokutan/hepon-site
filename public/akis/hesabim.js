// Hesabim paneli: /api/profile/me verisini tasarimcinin paneline isler.
// Oturum yoksa /profil/ sayfasina (giris/uyelik formu) yonlendirir.
(async () => {
  "use strict";

  const token = localStorage.getItem("hepon_token");
  const girise = () => { window.location.href = "/profil/"; };
  if (!token) return girise();

  let veri;
  try {
    const r = await fetch("/api/profile/me", { headers: { "x-session": token } });
    veri = await r.json();
  } catch (e) { return; }
  if (!veri || veri.error) { localStorage.removeItem("hepon_token"); return girise(); }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const URUN = { dask: "DASK Sigortası", travel: "Seyahat Sağlık Sigortası", trafik: "Trafik Sigortası",
                 kasko: "Kasko Sigortası", imm: "İMM Sigortası", tss: "Tamamlayıcı Sağlık Sigortası" };
  const DURUM = { received: ["Alındı", ""], quote_shown: ["Teklif hazır", "blue"],
                  completed: ["Tamamlandı", ""], cancelled: ["İptal", ""] };
  const tarih = (t) => t ? new Date(t).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" }) : "-";
  const ad = veri.fullName || veri.email || veri.phone || "Üyemiz";

  // Karsilama basligi
  document.querySelectorAll("h1").forEach((h) => {
    if (h.textContent.includes("Merhaba")) h.textContent = `Merhaba, ${ad} 👋`;
  });

  // Teklif tablolari (Son teklifler + Tekliflerim)
  const talepler = veri.requests || [];
  const satirlar = talepler.map((r) => {
    const [dt, dc] = DURUM[r.status] || [r.status, ""];
    return `<tr><td><b>${esc(URUN[r.product_type] || r.product_type)}</b></td>` +
      `<td><span class="hp-status ${dc}">${esc(dt)}</span></td>` +
      `<td>${tarih(r.created_at)}</td><td><a href="/#urunler">Yeni teklif →</a></td></tr>`;
  }).join("") || `<tr><td colspan="4">Henüz teklif talebiniz yok. <a href="/#urunler">Hemen teklif alın →</a></td></tr>`;
  document.querySelectorAll(".hp-table tbody").forEach((tb) => { tb.innerHTML = satirlar; });

  // Policeler (hem policeler sekmesi hem genel bakis karti)
  const policeler = veri.policies || [];
  const URUN_TAM = { dask: "DASK Sigortası", travel: "Seyahat Sağlık Sigortası", trafik: "Trafik Sigortası",
                     kasko: "Kasko Sigortası", imm: "İMM Sigortası", tss: "Tamamlayıcı Sağlık Sigortası" };
  const policeHtml = policeler.length
    ? policeler.map((p) => `<div class="hp-policy"><i class="hp-company">${esc((p.company_name || "H")[0])}</i>` +
        `<div><b>${esc(URUN_TAM[p.product_type] || p.product_type || "Poliçe")}</b>` +
        `<span>${esc(p.policy_no || "")} · ${esc(p.company_name || "")} · ${tarih(p.start_date)} – ${tarih(p.end_date)} · ` +
        `<a href="#" data-police-indir="${esc(p.policy_no)}">Belgeyi indir (PDF)</a></span></div><em>Aktif</em></div>`).join("")
    : `<div class="hp-policy"><div><b>Henüz poliçeniz yok</b>` +
      `<span>Teklif alarak ilk poliçenizi oluşturabilirsiniz.</span></div></div>`;

  // police PDF'i oturum basligiyla indirilir (duz link basligi tasiyamaz)
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-police-indir]");
    if (!b) return;
    ev.preventDefault();
    const r = await fetch("/api/profile/police/" + encodeURIComponent(b.dataset.policeIndir) + "/pdf",
      { headers: { "x-session": token } });
    if (!r.ok) return alert("Belge alınamadı");
    window.open(URL.createObjectURL(await r.blob()), "_blank");
  });
  document.querySelectorAll('[data-view="policies"] .hp-card, [data-view="renewals"] .hp-card').forEach((k) => {
    if (!k.querySelector("table")) k.innerHTML = policeHtml;
  });

  // Genel bakistaki demo 'Yenileme yaklasiyor' karti: police yoksa sadelestir
  if (!policeler.length) {
    document.querySelectorAll('[data-view="overview"] .hp-card').forEach((k) => {
      if (!k.querySelector("table") && /Yenileme/.test(k.textContent)) k.innerHTML = policeHtml;
    });
  }

  // Destek talepleri: kayit sistemimiz yok, iletisime yonlendir
  document.querySelectorAll('[data-view="support"] .hp-card').forEach((k) => {
    if (!k.querySelector("table")) {
      k.innerHTML = `<div class="hp-policy"><div><b>Destek talebiniz mi var?</b>` +
        `<span>Ekibimize <a href="/iletisim/">iletişim sayfasından</a> veya +90 212 211 24 25 numarasından ulaşabilirsiniz.</span></div></div>`;
    }
  });

  // Profilim
  const prof = document.querySelector('[data-view="profile"] .hp-policy');
  if (prof) {
    prof.innerHTML = `<i class="hp-company">${esc(ad[0].toUpperCase())}</i><div><b>${esc(ad)}</b>` +
      `<span>TC: ${esc(veri.nationalIdMasked || "-")} · Tel: ${esc(veri.phone || "-")} · E-posta: ${esc(veri.email || "-")}` +
      `${veri.addressText ? " · Adres: " + esc(veri.addressText) : ""}<br>` +
      `Üyelik: ${tarih(veri.memberSince)} · <a href="/profil/">Profili görüntüle / düzenle →</a></span></div>`;
  }

  // Sayfadaki modal tetikleyicileri (bu sayfada modal yok) urunlere yonlensin
  document.querySelectorAll(".hepon-teklif-trigger").forEach((a) => {
    a.classList.remove("hepon-teklif-trigger");
    if (a.tagName === "A") a.setAttribute("href", "/#urunler");
  });
})();
