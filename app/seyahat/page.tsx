"use client";
import { useState } from "react";

export default function SeyahatPage() {
  const [adim, setAdim] = useState(1);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [sonuc, setSonuc] = useState<any>(null);
  const [f, setF] = useState<any>({
    nationalId: "", phone: "", email: "", marketingConsent: false,
    region: "schengen", destinationCountry: "", startDate: "", endDate: "",
    travelReason: "is_turistik", sportActivity: false,
  });
  const [yolcular, setYolcular] = useState<{ nationalId: string; birthDate: string }[]>([]);
  const g = (k: string, v: any) => setF((o: any) => ({ ...o, [k]: v }));

  async function gonder() {
    setGonderiliyor(true);
    const tumYolcular = [{ nationalId: f.nationalId, birthDate: "" }, ...yolcular]
      .filter(y => y.nationalId.length === 11);
    const res = await fetch("/api/intake/travel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: { nationalId: f.nationalId, phone: f.phone, email: f.email, marketingConsent: f.marketingConsent },
        details: {
          region: f.region, destinationCountry: f.destinationCountry || null,
          startDate: f.startDate, endDate: f.endDate,
          travelReason: f.travelReason, sportActivity: f.sportActivity, channel: "form",
        },
        travelers: tumYolcular.map(y => ({ nationalId: y.nationalId, birthDate: y.birthDate || null })),
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
          <span className={"adim " + (adim === 2 ? "aktif" : "")}>2. Seyahat Bilgileri</span>
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
          <button className="btn" disabled={f.nationalId.length !== 11 || !f.phone || !f.email}
            onClick={() => setAdim(2)}>Devam</button>
        </>)}

        {adim === 2 && (<>
          <div className="satir">
            <div className="alan"><label>Seyahat Bolgesi</label>
              <select value={f.region} onChange={e => g("region", e.target.value)}>
                <option value="schengen">Schengen Ulkeleri</option>
                <option value="tum_avrupa">Tum Avrupa</option>
                <option value="tum_dunya">Tum Dunya</option>
              </select></div>
            <div className="alan"><label>Ulke (istege bagli)</label>
              <input value={f.destinationCountry} onChange={e => g("destinationCountry", e.target.value)} placeholder="Almanya" /></div>
          </div>
          <div className="satir">
            <div className="alan"><label>Gidis Tarihi</label>
              <input type="date" value={f.startDate} onChange={e => g("startDate", e.target.value)} /></div>
            <div className="alan"><label>Donus Tarihi</label>
              <input type="date" value={f.endDate} onChange={e => g("endDate", e.target.value)} /></div>
          </div>
          <p className="not">Vize islemleri icin police tarihlerini gidisten 1 gun once, donusten 1 gun sonra secmen onerilir.</p>
          <div className="alan radyolar"><label>Seyahat Sebebi</label>
            <label><input type="radio" checked={f.travelReason === "is_turistik"} onChange={() => g("travelReason", "is_turistik")} /> Is / Turistik</label>
            <label><input type="radio" checked={f.travelReason === "egitim"} onChange={() => g("travelReason", "egitim")} /> Egitim</label>
          </div>
          <div className="alan radyolar"><label>Sportif aktivite var mi?</label>
            <label><input type="radio" checked={f.sportActivity} onChange={() => g("sportActivity", true)} /> Var</label>
            <label><input type="radio" checked={!f.sportActivity} onChange={() => g("sportActivity", false)} /> Yok</label>
          </div>

          <div className="alan"><label>Ek Yolcular (siz otomatik dahilsiniz)</label>
            {yolcular.map((y, i) => (
              <div className="satir" key={i} style={{ marginBottom: 8 }}>
                <input maxLength={11} placeholder="Yolcu TC Kimlik No" value={y.nationalId}
                  onChange={e => { const k = [...yolcular]; k[i].nationalId = e.target.value.replace(/\D/g, ""); setYolcular(k); }} />
                <input type="date" value={y.birthDate}
                  onChange={e => { const k = [...yolcular]; k[i].birthDate = e.target.value; setYolcular(k); }} />
              </div>
            ))}
            <button className="btn btn-gri" type="button"
              onClick={() => setYolcular([...yolcular, { nationalId: "", birthDate: "" }])}>+ Kisi Ekle</button>
          </div>

          <button className="btn btn-gri" onClick={() => setAdim(1)}>Geri</button>
          <button className="btn" disabled={gonderiliyor || !f.startDate || !f.endDate} onClick={gonder}>
            {gonderiliyor ? "Gonderiliyor..." : "Teklif Talebi Olustur"}</button>
        </>)}
      </div>
    </main>
  );
}
