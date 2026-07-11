"use client";
import { useEffect, useState } from "react";

export default function ProfilPage() {
  const [mod, setMod] = useState<"giris" | "kayit" | "panel">("giris");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [profil, setProfil] = useState<any>(null);
  const [f, setF] = useState<any>({
    nationalId: "", password: "", email: "", phone: "", fullName: "",
    addressText: "", maritalStatus: "", profession: "", education: "",
  });
  const g = (k: string, v: any) => setF((o: any) => ({ ...o, [k]: v }));

  useEffect(() => {
    const t = localStorage.getItem("hepon_token");
    if (t) profilYukle(t);
  }, []);

  async function profilYukle(token: string) {
    const res = await fetch("/api/profile/me", { headers: { "x-session": token } });
    const data = await res.json();
    if (data.error) { localStorage.removeItem("hepon_token"); return; }
    setProfil(data);
    setMod("panel");
  }

  async function girisYap() {
    setYukleniyor(true); setHata("");
    const res = await fetch("/api/profile/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: f.nationalId, password: f.password }),
    });
    const data = await res.json();
    setYukleniyor(false);
    if (data.error) { setHata(data.error); return; }
    localStorage.setItem("hepon_token", data.token);
    profilYukle(data.token);
  }

  async function kayitOl() {
    setYukleniyor(true); setHata("");
    const res = await fetch("/api/profile/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setYukleniyor(false);
    if (data.error) { setHata(data.error); return; }
    localStorage.setItem("hepon_token", data.token);
    profilYukle(data.token);
  }

  function cikis() {
    localStorage.removeItem("hepon_token");
    setProfil(null); setMod("giris");
  }

  if (mod === "panel" && profil) return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Merhaba, {profil.fullName ?? "Uyemiz"}</h1>
          <button className="btn btn-cerceve" onClick={cikis} style={{ cursor: "pointer" }}>Cikis Yap</button>
        </div>
      </section>
      <main className="bolum">
        <div className="wrap">
          <div className="panel">
            <h3 style={{ marginBottom: 16 }}>Bilgilerim</h3>
            <div className="satir">
              <div className="alan"><label>TC Kimlik No</label>
                <input value={profil.nationalIdMasked} disabled style={{ background: "#f1f5f9", letterSpacing: 2 }} /></div>
              <div className="alan"><label>Ad Soyad</label><input value={profil.fullName ?? ""} disabled style={{ background: "#f1f5f9" }} /></div>
            </div>
            <div className="satir">
              <div className="alan"><label>E-posta</label><input value={profil.email ?? ""} disabled style={{ background: "#f1f5f9" }} /></div>
              <div className="alan"><label>Telefon</label><input value={profil.phone ?? ""} disabled style={{ background: "#f1f5f9" }} /></div>
            </div>
            <div className="satir">
              <div className="alan"><label>Meslek</label><input value={profil.profession ?? "-"} disabled style={{ background: "#f1f5f9" }} /></div>
              <div className="alan"><label>Egitim</label><input value={profil.education ?? "-"} disabled style={{ background: "#f1f5f9" }} /></div>
            </div>
            <div className="satir">
              <div className="alan"><label>Medeni Durum</label><input value={profil.maritalStatus ?? "-"} disabled style={{ background: "#f1f5f9" }} /></div>
              <div className="alan"><label>Adres</label><input value={profil.addressText ?? "-"} disabled style={{ background: "#f1f5f9" }} /></div>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 16 }}>Policelerim</h3>
            {profil.policies.length === 0
              ? <p className="not">Henuz kayitli policeniz yok. Teklif alarak baslayabilirsiniz.</p>
              : profil.policies.map((p: any, i: number) => (
                  <div key={i} className="hizmet" style={{ marginBottom: 10 }}>
                    <h4>{p.company_name} | {p.product_type === "dask" ? "DASK" : "Seyahat"}</h4>
                    <p>Police No: {p.policy_no} | Prim: {p.sold_premium} TL | {p.start_date?.slice(0,10)} / {p.end_date?.slice(0,10)}</p>
                  </div>
                ))}
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 16 }}>Teklif Taleplerim</h3>
            {profil.requests.length === 0
              ? <p className="not">Henuz teklif talebiniz yok.</p>
              : profil.requests.map((r: any) => (
                  <div key={r.id} className="hizmet" style={{ marginBottom: 10 }}>
                    <h4>{r.product_type === "dask" ? "DASK" : "Seyahat"} | Talep No: {r.id}</h4>
                    <p>Durum: {r.status === "quote_shown" ? "Teklif Gosterildi" : r.status === "converted" ? "Satin Alindi" : r.status} | {r.created_at?.slice(0,10)}</p>
                  </div>
                ))}
            <div style={{ marginTop: 16 }}>
              <a className="btn" href="/dask/" style={{ marginRight: 10 }}>Yeni DASK Teklifi</a>
              <a className="btn btn-gri" href="/seyahat/" style={{ textDecoration: "none", display: "inline-block" }}>Yeni Seyahat Teklifi</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );

  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap"><h1>{mod === "giris" ? "Giris Yap" : "Uye Ol"}</h1></div>
      </section>
      <main className="bolum">
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div className="panel">
            <div className="adimlar">
              <span className={"adim " + (mod === "giris" ? "aktif" : "")} style={{ cursor: "pointer" }} onClick={() => { setMod("giris"); setHata(""); }}>Giris Yap</span>
              <span className={"adim " + (mod === "kayit" ? "aktif" : "")} style={{ cursor: "pointer" }} onClick={() => { setMod("kayit"); setHata(""); }}>Uye Ol</span>
            </div>

            {mod === "giris" && (<>
               <div className="alan"><label>E-posta, Telefon veya TC Kimlik No</label>
                <input value={f.nationalId} onChange={e => g("nationalId", e.target.value)} placeholder="ornek@mail.com" /></div>
              <div className="alan"><label>Sifre</label>
                <input type="password" value={f.password} onChange={e => g("password", e.target.value)} /></div>
              {hata && <p className="not" style={{ color: "#dc2626" }}>{hata}</p>}
              <button className="btn" disabled={yukleniyor || !f.nationalId || !f.password} onClick={girisYap}>
                {yukleniyor ? "Giris yapiliyor..." : "Giris Yap"}</button>
              <p className="not" style={{ marginTop: 14 }}>Profil olusturursan policelerini ve tekliflerini tek yerden takip edebilirsin.</p>
            </>)}

            {mod === "kayit" && (<>
              <div className="satir">
                <div className="alan"><label>TC Kimlik No</label>
                  <input maxLength={11} value={f.nationalId} onChange={e => g("nationalId", e.target.value.replace(/\D/g, ""))} /></div>
                <div className="alan"><label>Ad Soyad</label>
                  <input value={f.fullName} onChange={e => g("fullName", e.target.value)} /></div>
              </div>
              <div className="satir">
                <div className="alan"><label>E-posta</label>
                  <input type="email" value={f.email} onChange={e => g("email", e.target.value)} /></div>
                <div className="alan"><label>Telefon</label>
                  <input value={f.phone} onChange={e => g("phone", e.target.value)} placeholder="05xx xxx xx xx" /></div>
              </div>
              <div className="alan"><label>Sifre</label>
                <input type="password" value={f.password} onChange={e => g("password", e.target.value)} placeholder="En az 6 karakter" /></div>
              <div className="alan"><label>Adres</label>
                <input value={f.addressText} onChange={e => g("addressText", e.target.value)} /></div>
              <div className="satir">
                <div className="alan"><label>Medeni Durum</label>
                  <select value={f.maritalStatus} onChange={e => g("maritalStatus", e.target.value)}>
                    <option value="">Seciniz</option><option>Bekar</option><option>Evli</option>
                  </select></div>
                <div className="alan"><label>Egitim Durumu</label>
                  <select value={f.education} onChange={e => g("education", e.target.value)}>
                    <option value="">Seciniz</option><option>Ilkogretim</option><option>Lise</option>
                    <option>Universite</option><option>Yuksek Lisans / Doktora</option>
                  </select></div>
              </div>
              <div className="alan"><label>Meslek</label>
                <input value={f.profession} onChange={e => g("profession", e.target.value)} placeholder="Ornek: Muhendis, Ogretmen, Avukat" /></div>
              {hata && <p className="not" style={{ color: "#dc2626" }}>{hata}</p>}
              <button className="btn" disabled={yukleniyor || f.nationalId.length !== 11 || !f.email || !f.phone || f.password.length < 6} onClick={kayitOl}>
                {yukleniyor ? "Kayit yapiliyor..." : "Uye Ol"}</button>
            </>)}
          </div>
        </div>
      </main>
    </>
  );
}
