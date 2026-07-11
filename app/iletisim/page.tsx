export default function Iletisim() {
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap"><h1>İletişim</h1></div>
      </section>
      <main className="bolum">
        <div className="wrap">
          <div className="ozellikler" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="ozellik">
              <div className="ikon">📞</div>
              <h3>Telefon</h3>
              <p><a href="tel:902122112425" style={{ color: "inherit" }}>+90 212 211 24 25</a><br/>
                 <a href="tel:905333290842" style={{ color: "inherit" }}>+90 533 329 08 42</a></p>
            </div>
            <div className="ozellik">
              <div className="ikon">✉️</div>
              <h3>E-posta</h3>
              <p><a href="mailto:info@heponsigorta.com" style={{ color: "inherit" }}>info@heponsigorta.com</a></p>
            </div>
            <div className="ozellik">
              <div className="ikon">🕘</div>
              <h3>Çalışma Saatleri</h3>
              <p>Pazartesi - Cuma<br/>09:00 - 17:30</p>
            </div>
          </div>
          <div className="cta-band" style={{ marginTop: 24 }}>
            <div>
              <h3>Adresimiz</h3>
              <p>Mecidiyeköy Mh. Mecidiye Cd. Cansızoğlu Pasajı No: 7/3, Şişli, İstanbul, Türkiye</p>
            </div>
            <a className="btn" target="_blank" rel="noreferrer"
               href="https://www.google.com/maps/search/?api=1&query=Mecidiyek%C3%B6y+Mecidiye+Cd.+Cans%C4%B1zo%C4%9Flu+Pasaj%C4%B1+No+7+%C5%9Ei%C5%9Fli">Yol Tarifi</a>
          </div>
        </div>
      </main>
    </>
  );
}
