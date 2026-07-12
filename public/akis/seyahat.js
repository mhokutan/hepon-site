// Seyahat saglik gercek teklif akisi: /api/intake/travel ucuna baglanir.
// Sayfadaki .hepon-akis-ac elemanlari modali acar (JS yoksa href /seyahat/ sayfasina duser).
(() => {
  "use strict";

  const modal = document.createElement("div");
  modal.className = "hepon-akis-modal";
  modal.innerHTML = `
  <div class="hepon-akis-perde" data-kapat></div>
  <div class="hepon-akis-kutu" role="dialog" aria-modal="true" aria-label="Seyahat sağlık teklif talebi">
    <button class="hepon-akis-kapat" data-kapat type="button" aria-label="Kapat">×</button>
    <h3>Seyahat Sağlık Teklif Talebi</h3>
    <p class="aciklama">Bilgilerinizi paylaşın, vize başvurusuna uygun teklifinizi hazırlayalım.</p>
    <div class="hepon-akis-adimlar">
      <span class="hepon-akis-adim aktif" data-adim-etiket="1">1. Kişi Bilgileri</span>
      <span class="hepon-akis-adim" data-adim-etiket="2">2. Seyahat Bilgileri</span>
    </div>
    <div class="hepon-akis-hata"></div>
    <div data-adim="1">
      <div class="hepon-akis-alan"><label>TC Kimlik No</label>
        <input name="nationalId" maxlength="11" inputmode="numeric" placeholder="11 haneli"></div>
      <div class="hepon-akis-satir">
        <div class="hepon-akis-alan"><label>Cep Telefonu</label><input name="phone" placeholder="05xx xxx xx xx"></div>
        <div class="hepon-akis-alan"><label>E-posta</label><input name="email" type="email" placeholder="ornek@mail.com"></div>
      </div>
      <div class="hepon-akis-radyolar"><label><input type="checkbox" name="marketingConsent"> Kampanya ve fırsatlardan haberdar olmak istiyorum</label></div>
      <div class="hepon-akis-btnlar"><button class="hepon-akis-btn" data-ileri type="button">Devam Et</button></div>
    </div>
    <div data-adim="2" hidden>
      <div class="hepon-akis-satir">
        <div class="hepon-akis-alan"><label>Seyahat Bölgesi</label>
          <select name="region">
            <option value="schengen">Schengen Ülkeleri</option>
            <option value="tum_avrupa">Tüm Avrupa</option>
            <option value="tum_dunya">Tüm Dünya</option>
          </select></div>
        <div class="hepon-akis-alan"><label>Ülke (isteğe bağlı)</label><input name="destinationCountry" placeholder="Almanya"></div>
      </div>
      <div class="hepon-akis-satir">
        <div class="hepon-akis-alan"><label>Gidiş Tarihi</label><input name="startDate" type="date"></div>
        <div class="hepon-akis-alan"><label>Dönüş Tarihi</label><input name="endDate" type="date"></div>
      </div>
      <p class="hepon-akis-not">Vize işlemleri için poliçe tarihlerini gidişten 1 gün önce, dönüşten 1 gün sonra seçmeniz önerilir.</p>
      <div class="hepon-akis-radyolar hepon-akis-alan" style="margin-top:10px"><label>Seyahat Sebebi:</label>
        <label><input type="radio" name="travelReason" value="is_turistik" checked> İş / Turistik</label>
        <label><input type="radio" name="travelReason" value="egitim"> Eğitim</label>
      </div>
      <div class="hepon-akis-radyolar hepon-akis-alan"><label>Sportif aktivite:</label>
        <label><input type="radio" name="sportActivity" value="evet"> Var</label>
        <label><input type="radio" name="sportActivity" value="hayir" checked> Yok</label>
      </div>
      <div class="hepon-akis-alan"><label>Ek Yolcular (siz otomatik dahilsiniz)</label>
        <div data-yolcular></div>
        <button class="hepon-akis-btn gri" data-yolcu-ekle type="button" style="padding:9px 18px;font-size:13.5px">+ Kişi Ekle</button>
      </div>
      <div class="hepon-akis-btnlar">
        <button class="hepon-akis-btn gri" data-geri type="button">Geri</button>
        <button class="hepon-akis-btn" data-gonder type="button">Teklif Talebi Oluştur</button>
      </div>
    </div>
    <div data-adim="basari" hidden></div>
  </div>`;
  document.body.appendChild(modal);

  const kutu = modal.querySelector(".hepon-akis-kutu");
  const hata = modal.querySelector(".hepon-akis-hata");
  const deger = (ad) => kutu.querySelector(`[name="${ad}"]`).value.trim();

  function adimGoster(n) {
    kutu.querySelectorAll("[data-adim]").forEach(b => { b.hidden = b.dataset.adim !== String(n); });
    kutu.querySelectorAll("[data-adim-etiket]").forEach(e =>
      e.classList.toggle("aktif", e.dataset.adimEtiket === String(n)));
    hata.classList.remove("goster");
  }
  function hataGoster(mesaj) { hata.textContent = mesaj; hata.classList.add("goster"); }

  modal.addEventListener("click", async (ev) => {
    if (ev.target.closest("[data-kapat]")) {
      modal.classList.remove("acik"); document.body.classList.remove("hepon-akis-acik"); return;
    }
    if (ev.target.closest("[data-geri]")) { adimGoster(1); return; }
    if (ev.target.closest("[data-ileri]")) {
      if (!/^\d{11}$/.test(deger("nationalId"))) return hataGoster("TC Kimlik No 11 haneli olmalı.");
      if (!deger("phone")) return hataGoster("Cep telefonu gerekli.");
      if (!deger("email")) return hataGoster("E-posta gerekli.");
      adimGoster(2); return;
    }
    if (ev.target.closest("[data-yolcu-ekle]")) {
      const satir = document.createElement("div");
      satir.className = "hepon-akis-satir";
      satir.style.marginBottom = "8px";
      satir.innerHTML = `<div class="hepon-akis-alan" style="margin:0"><input data-yolcu-tc maxlength="11" inputmode="numeric" placeholder="Yolcu TC Kimlik No"></div>
        <div class="hepon-akis-alan" style="margin:0"><input data-yolcu-dogum type="date"></div>`;
      kutu.querySelector("[data-yolcular]").appendChild(satir);
      return;
    }
    const gonderBtn = ev.target.closest("[data-gonder]");
    if (!gonderBtn) return;
    if (!deger("startDate") || !deger("endDate")) return hataGoster("Gidiş ve dönüş tarihleri gerekli.");
    gonderBtn.disabled = true; gonderBtn.textContent = "Gönderiliyor...";
    const yolcular = [{ nationalId: deger("nationalId"), birthDate: null }];
    kutu.querySelectorAll("[data-yolcular] .hepon-akis-satir").forEach(s => {
      const tc = s.querySelector("[data-yolcu-tc]").value.trim();
      if (/^\d{11}$/.test(tc)) yolcular.push({ nationalId: tc, birthDate: s.querySelector("[data-yolcu-dogum]").value || null });
    });
    try {
      const res = await fetch("/api/intake/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            nationalId: deger("nationalId"), phone: deger("phone"), email: deger("email"),
            marketingConsent: kutu.querySelector('[name="marketingConsent"]').checked,
          },
          details: {
            region: deger("region"), destinationCountry: deger("destinationCountry") || null,
            startDate: deger("startDate"), endDate: deger("endDate"),
            travelReason: kutu.querySelector('[name="travelReason"]:checked').value,
            sportActivity: kutu.querySelector('[name="sportActivity"]:checked').value === "evet",
            channel: "tema-sayfa",
          },
          travelers: yolcular,
        }),
      });
      const data = await res.json();
      if (data && data.ok) {
        const b = kutu.querySelector('[data-adim="basari"]');
        b.innerHTML = `<div class="hepon-akis-basari"><div class="rozet">✓</div>
          <h3>Talebiniz alındı</h3>
          <p class="aciklama">Talep numaranız: <b>${data.requestId}</b>. Teklifleriniz hazırlanıp size iletilecek.</p>
          <p class="hepon-akis-not">Profil oluşturursanız taleplerinizi tek yerden takip edebilirsiniz.</p>
          <div class="hepon-akis-btnlar" style="justify-content:center">
            <a class="hepon-akis-btn" href="/profil/" style="text-decoration:none">Profil Oluştur</a>
            <button class="hepon-akis-btn gri" data-kapat type="button">Kapat</button>
          </div></div>`;
        adimGoster("basari");
      } else {
        hataGoster((data && data.error) || "Talep gönderilemedi, lütfen tekrar deneyin.");
      }
    } catch (e) {
      hataGoster("Bağlantı hatası, lütfen tekrar deneyin.");
    }
    gonderBtn.disabled = false; gonderBtn.textContent = "Teklif Talebi Oluştur";
  });

  document.addEventListener("click", (ev) => {
    const ac = ev.target.closest(".hepon-akis-ac");
    if (!ac) return;
    ev.preventDefault();
    adimGoster(1);
    modal.classList.add("acik");
    document.body.classList.add("hepon-akis-acik");
  });
})();
