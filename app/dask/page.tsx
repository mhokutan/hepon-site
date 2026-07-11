"use client";
import { useState } from "react";

export default function DaskPage() {
  const [adim, setAdim] = useState(1);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [sonuc, setSonuc] = useState<any>(null);
  const [f, setF] = useState<any>({
    nationalId: "", phone: "", email: "", marketingConsent: false,
    isRenewal: false, existingPolicyNo: "", uavtCode: "",
    province: "", district: "", neighborhood: "", squareMeters: "",
    buildingYear: "", structureType: "", totalFloorCount: "",
    floorNumber: "", usageType: "MESKEN", damageStatus: "HASARSIZ",
    insurerRole: "MAL_SAHIBI", hasMortgage: false,
  });
  const g = (k: string, v: any) => setF((o: any) => ({ ...o, [k]: v }));

  async function gonder() {
    setGonderiliyor(true);
    const res = await fetch("/api/intake/dask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { nationalId: f.nationalId, phone: f.phone, email: f.email, marketingConsent: f.marketingConsent },
        details: {
          isRenewal: f.isRenewal, existingPolicyNo: f.existingPolicyNo || null,
          uavtCode: f.uavtCode || null, province: f.province, district: f.district,
          neighborhood: f.neighborhood, squareMeters: Number(f.squareMeters) || null,
          buildingYear: f.buildingYear, structureType: f.structureType,
          totalFloorCount: f.totalFloorCount, floorNumber: f.floorNumber,
          usageType: f.usageType, damageStatus: f.damageStatus,
          insurerRole: f.insurerRole, hasMortgage: f.hasMortgage, channel: "form",
        },
      }),
    });
    const data = await res.json();
    setGonderiliyor(false);
    setSonuc(data);
  }

  if (sonuc?.ok) return (
    <main className="wrap"><div className="panel basari">
      <h2>Talebiniz alindi</h2>
      <p>Talep numaraniz: <b>{sonuc.requestId}</b>. Teklifleriniz hazirlanip size iletilecek.</p>
      <p className="not">Demo surumu: bu asamada gercek sigorta sirketi teklifi cekilmiyor.</p>
      <p className="not" style={{ marginTop: 12 }}>Profil olusturursan bu talebini ve gelecekteki policelerini tek yerden takip edebilirsin.</p>
      <div style={{ marginTop: 14 }}><a className="btn" href="/profil/" style={{ marginRight: 10 }}>Profil Olustur</a><a className="btn btn-gri" href="/" style={{ textDecoration: "none", display: "inline-block" }}>Ana Sayfa</a></div>
    </div></main>
  );

  return (
    <main className="wrap">
      <div className="panel">
        <div className="adimlar">
          <span className={"adim " + (adim === 1 ? "aktif" : "")}>1. Kisi Bilgileri</span>
          <span className={"adim " + (adim === 2 ? "aktif" : "")}>2. Konut Bilgileri</span>
        </div>

        {adim === 1 && (<>
          <div className="alan"><label>TC Kimlik No</label>
            <input maxLength={11} value={f.nationalId} onChange={e => g("nationalId", e.target.value.replace(/\D/g, ""))} placeholder="11 haneli" /></div>
          <div className="satir">
            <div className="alan"><label>Cep Telefonu</label>
              <input value={f.phone} onChange={e => g("phone", e.target.value)} placeholder="05xx xxx xx xx" /></div>
            <div className="alan"><label>E-posta</label>
              <input type="email" value={f.email} onChange={e => g("email", e.target.value)} placeholder="ornek@mail.com" /></div>
          </div>
          <div className="alan radyolar"><label>
            <input type="checkbox" checked={f.marketingConsent} onChange={e => g("marketingConsent", e.target.checked)} />
            Kampanya ve firsatlardan haberdar olmak istiyorum</label></div>
          <p className="not">Gercek surumde TC kimlik dogrulamasi ve SMS kodu bu adimda yapilacak.</p>
          <button className="btn" disabled={f.nationalId.length !== 11 || !f.phone || !f.email}
            onClick={() => setAdim(2)}>Devam</button>
        </>)}

        {adim === 2 && (<>
          <div className="alan radyolar">
            <label><input type="radio" checked={!f.isRenewal} onChange={() => g("isRenewal", false)} /> Yeni police</label>
            <label><input type="radio" checked={f.isRenewal} onChange={() => g("isRenewal", true)} /> Mevcut policemi yenile</label>
          </div>
          {f.isRenewal ? (
            <div className="alan"><label>Mevcut DASK Police No</label>
              <input value={f.existingPolicyNo} onChange={e => g("existingPolicyNo", e.target.value)} /></div>
          ) : (
            <div className="alan"><label>UAVT (Adres) Kodu</label>
              <input maxLength={10} value={f.uavtCode} onChange={e => g("uavtCode", e.target.value.replace(/\D/g, ""))} placeholder="10 haneli" />
              <p className="not">Gercek surumde UAVT sorgusu sigorta sirketi uzerinden otomatik yapilacak.</p></div>
          )}
          <div className="satir">
            <div className="alan"><label>Il</label><input value={f.province} onChange={e => g("province", e.target.value)} /></div>
            <div className="alan"><label>Ilce</label><input value={f.district} onChange={e => g("district", e.target.value)} /></div>
          </div>
          <div className="satir">
            <div className="alan"><label>Brut m2</label><input value={f.squareMeters} onChange={e => g("squareMeters", e.target.value.replace(/\D/g, ""))} /></div>
            <div className="alan"><label>Bina Insaat Yili</label>
              <select value={f.buildingYear} onChange={e => g("buildingYear", e.target.value)}>
                <option value="">Seciniz</option><option>2026</option><option>2025</option><option>2020-2024</option>
                <option>2010-2019</option><option>2000-2009</option><option>1980-1999</option><option>1975 VE ONCESI</option>
              </select></div>
          </div>
          <div className="satir">
            <div className="alan"><label>Bina Yapi Tarzi</label>
              <select value={f.structureType} onChange={e => g("structureType", e.target.value)}>
                <option value="">Seciniz</option><option value="CELIK_BETONARME">Celik, Betonarme, Karkas</option><option value="DIGER">Diger</option>
              </select></div>
            <div className="alan"><label>Toplam Kat Sayisi</label>
              <select value={f.totalFloorCount} onChange={e => g("totalFloorCount", e.target.value)}>
                <option value="">Seciniz</option><option>01-03 ARASI</option><option>04-07 ARASI</option><option>08-18 ARASI</option><option>19 VE UZERI</option>
              </select></div>
          </div>
          <div className="satir">
            <div className="alan"><label>Bulundugu Kat</label>
              <select value={f.floorNumber} onChange={e => g("floorNumber", e.target.value)}>
                <option value="">Seciniz</option><option>-1 VE ALTI</option><option>ZEMIN</option><option>1-3</option><option>4-7</option><option>8 VE UZERI</option>
              </select></div>
            <div className="alan"><label>Kullanim Tarzi</label>
              <select value={f.usageType} onChange={e => g("usageType", e.target.value)}>
                <option>MESKEN</option><option>TICARETHANE</option><option>DIGER</option>
              </select></div>
          </div>
          <div className="satir">
            <div className="alan"><label>Hasar Durumu</label>
              <select value={f.damageStatus} onChange={e => g("damageStatus", e.target.value)}>
                <option>HASARSIZ</option><option>AZ HASARLI</option><option>ORTA HASARLI</option>
              </select></div>
            <div className="alan"><label>Sigorta Ettirenin Sifati</label>
              <select value={f.insurerRole} onChange={e => g("insurerRole", e.target.value)}>
                <option>MAL_SAHIBI</option><option>KIRACI</option><option>INTIFA_HAKKI_SAHIBI</option>
                <option>YONETICI</option><option>AKRABA</option><option>DAIN_I_MURTEHIN</option><option>DIGER</option>
              </select></div>
          </div>
          <div className="alan radyolar"><label>Konutta devam eden kredi var mi?</label>
            <label><input type="radio" checked={f.hasMortgage} onChange={() => g("hasMortgage", true)} /> Evet</label>
            <label><input type="radio" checked={!f.hasMortgage} onChange={() => g("hasMortgage", false)} /> Hayir</label>
          </div>
          <button className="btn btn-gri" onClick={() => setAdim(1)}>Geri</button>
          <button className="btn" disabled={gonderiliyor} onClick={gonder}>
            {gonderiliyor ? "Gonderiliyor..." : "Teklif Talebi Olustur"}</button>
        </>)}
      </div>
    </main>
  );
}
