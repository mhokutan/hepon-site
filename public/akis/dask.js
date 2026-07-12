// DASK gercek teklif akisi: /api/intake/dask ucuna baglanir.
// Sayfadaki .hepon-akis-ac elemanlari modali acar (JS yoksa href /dask/ sayfasina duser).
(() => {
  "use strict";

  const SECENEK = {
    buildingYear: ["2026", "2025", "2020-2024", "2010-2019", "2000-2009", "1980-1999", "1975 VE ONCESI"],
    totalFloorCount: ["01-03 ARASI", "04-07 ARASI", "08-18 ARASI", "19 VE UZERI"],
    floorNumber: ["-1 VE ALTI", "ZEMIN", "1-3", "4-7", "8 VE UZERI"],
    usageType: ["MESKEN", "TICARETHANE", "DIGER"],
    damageStatus: ["HASARSIZ", "AZ HASARLI", "ORTA HASARLI"],
    insurerRole: ["MAL_SAHIBI", "KIRACI", "INTIFA_HAKKI_SAHIBI", "YONETICI", "AKRABA", "DAIN_I_MURTEHIN", "DIGER"],
  };
  const sec = (ad, etiket) =>
    `<div class="hepon-akis-alan"><label>${etiket}</label><select name="${ad}">` +
    `<option value="">Seciniz</option>` + SECENEK[ad].map(o => `<option>${o}</option>`).join("") +
    `</select></div>`;

  const modal = document.createElement("div");
  modal.className = "hepon-akis-modal";
  modal.innerHTML = `
  <div class="hepon-akis-perde" data-kapat></div>
  <div class="hepon-akis-kutu" role="dialog" aria-modal="true" aria-label="DASK teklif talebi">
    <button class="hepon-akis-kapat" data-kapat type="button" aria-label="Kapat">×</button>
    <h3>DASK Teklif Talebi</h3>
    <p class="aciklama">Bilgilerinizi paylaşın, teklifinizi hazırlayıp size iletelim.</p>
    <div class="hepon-akis-adimlar">
      <span class="hepon-akis-adim aktif" data-adim-etiket="1">1. Kişi Bilgileri</span>
      <span class="hepon-akis-adim" data-adim-etiket="2">2. Konut Bilgileri</span>
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
      <div class="hepon-akis-radyolar hepon-akis-alan">
        <label><input type="radio" name="isRenewal" value="hayir" checked> Yeni poliçe</label>
        <label><input type="radio" name="isRenewal" value="evet"> Mevcut poliçemi yenile</label>
      </div>
      <div class="hepon-akis-alan" data-yeni><label>UAVT (Adres) Kodu</label>
        <input name="uavtCode" maxlength="10" inputmode="numeric" placeholder="10 haneli"></div>
      <div class="hepon-akis-alan" data-yenileme hidden><label>Mevcut DASK Poliçe No</label>
        <input name="existingPolicyNo"></div>
      <div class="hepon-akis-satir">
        <div class="hepon-akis-alan"><label>İl</label><input name="province"></div>
        <div class="hepon-akis-alan"><label>İlçe</label><input name="district"></div>
      </div>
      <div class="hepon-akis-satir">
        <div class="hepon-akis-alan"><label>Mahalle</label><input name="neighborhood"></div>
        <div class="hepon-akis-alan"><label>Brüt m²</label><input name="squareMeters" inputmode="numeric"></div>
      </div>
      <div class="hepon-akis-satir">${sec("buildingYear", "Bina İnşaat Yılı")}
        <div class="hepon-akis-alan"><label>Bina Yapı Tarzı</label><select name="structureType">
          <option value="">Seciniz</option><option value="CELIK_BETONARME">Çelik, Betonarme, Karkas</option><option value="DIGER">Diğer</option></select></div>
      </div>
      <div class="hepon-akis-satir">${sec("totalFloorCount", "Toplam Kat Sayısı")}${sec("floorNumber", "Bulunduğu Kat")}</div>
      <div class="hepon-akis-satir">${sec("usageType", "Kullanım Tarzı")}${sec("damageStatus", "Hasar Durumu")}</div>
      <div class="hepon-akis-satir">${sec("insurerRole", "Sigorta Ettirenin Sıfatı")}
        <div class="hepon-akis-alan"><label>Konutta devam eden kredi var mı?</label>
          <div class="hepon-akis-radyolar" style="margin-top:8px">
            <label><input type="radio" name="hasMortgage" value="evet"> Evet</label>
            <label><input type="radio" name="hasMortgage" value="hayir" checked> Hayır</label>
          </div></div>
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
  const isaretli = (ad) => kutu.querySelector(`[name="${ad}"]:checked`);

  function adimGoster(n) {
    kutu.querySelectorAll("[data-adim]").forEach(b => { b.hidden = b.dataset.adim !== String(n); });
    kutu.querySelectorAll("[data-adim-etiket]").forEach(e =>
      e.classList.toggle("aktif", e.dataset.adimEtiket === String(n)));
    hata.classList.remove("goster");
  }
  function hataGoster(mesaj) { hata.textContent = mesaj; hata.classList.add("goster"); }

  modal.addEventListener("change", (ev) => {
    if (ev.target.name === "isRenewal") {
      const yenileme = ev.target.value === "evet";
      kutu.querySelector("[data-yeni]").hidden = yenileme;
      kutu.querySelector("[data-yenileme]").hidden = !yenileme;
    }
  });

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
    const gonderBtn = ev.target.closest("[data-gonder]");
    if (!gonderBtn) return;
    if (!deger("province") || !deger("district")) return hataGoster("İl ve ilçe gerekli.");
    gonderBtn.disabled = true; gonderBtn.textContent = "Gönderiliyor...";
    const yenileme = isaretli("isRenewal").value === "evet";
    try {
      const res = await fetch("/api/intake/dask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            nationalId: deger("nationalId"), phone: deger("phone"), email: deger("email"),
            marketingConsent: kutu.querySelector('[name="marketingConsent"]').checked,
          },
          details: {
            isRenewal: yenileme, existingPolicyNo: yenileme ? (deger("existingPolicyNo") || null) : null,
            uavtCode: yenileme ? null : (deger("uavtCode") || null),
            province: deger("province"), district: deger("district"), neighborhood: deger("neighborhood"),
            squareMeters: Number(deger("squareMeters")) || null,
            buildingYear: deger("buildingYear"), structureType: deger("structureType"),
            totalFloorCount: deger("totalFloorCount"), floorNumber: deger("floorNumber"),
            usageType: deger("usageType") || "MESKEN", damageStatus: deger("damageStatus") || "HASARSIZ",
            insurerRole: deger("insurerRole") || "MAL_SAHIBI",
            hasMortgage: isaretli("hasMortgage").value === "evet", channel: "tema-sayfa",
          },
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
