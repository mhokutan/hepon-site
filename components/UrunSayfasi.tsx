import TeklifModal from "./TeklifModal";
import type { UrunIcerik } from "./urun-verileri";

const nedenHepon = [
  "Teklif alma ve poliçe oluşturma akışını tek ekranda yönetme",
  "Fiyatla birlikte kapsam, limit ve önemli poliçe farklarını daha anlaşılır değerlendirme",
  "Gerektiğinde gerçek Hepon danışmanına ulaşabilme",
  "Poliçe belgesi, yenileme ve destek süreçlerini dijital olarak takip etme",
];

function TeklifCta({ urun, cerceve }: { urun: UrunIcerik; cerceve?: boolean }) {
  const sinif = cerceve ? "btn btn-cerceve" : "btn";
  if (urun.cta.tip === "modal") {
    return (
      <button className={`${sinif} hepon-teklif-trigger`} data-product={urun.cta.urunKodu} type="button">
        Hemen Teklif Al
      </button>
    );
  }
  if (urun.cta.tip === "link") {
    return <a className={sinif} href={urun.cta.href}>Hemen Teklif Al</a>;
  }
  return <a className={sinif} href="/iletisim/">Danışmanımızdan Teklif Al</a>;
}

export default function UrunSayfasi({ urun }: { urun: UrunIcerik }) {
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap">
          <h1>{urun.h1}</h1>
          <p style={{ color: "#b9c6dd", marginTop: 10, maxWidth: "62ch" }}>{urun.heroAlt}</p>
          <div style={{ marginTop: 22 }}>
            <TeklifCta urun={urun} />
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="wrap icerik">
          <h3>{urun.ad} nedir?</h3>
          <p>{urun.nedir}</p>

          <h3>{urun.kimlerBaslik}</h3>
          <div className="hizmet-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
            {urun.kimler.map((k) => (
              <div key={k} className="hizmet"><h4>{k}</h4></div>
            ))}
          </div>

          <h3>{urun.teminatBaslik}</h3>
          <p className="not">{urun.teminatNot}</p>
          <div className="hizmet-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
            {urun.teminatlar.map((t) => (
              <div key={t} className="hizmet"><p style={{ marginTop: 0 }}>{t}</p></div>
            ))}
          </div>

          <h3>Neden Hepon&apos;la?</h3>
          <div className="hizmet-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
            {nedenHepon.map((n) => (
              <div key={n} className="hizmet"><p style={{ marginTop: 0 }}>{n}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h3>Poliçe Sonrası da Yanınızdayız</h3>
              <p>Hasar, yenileme ve tüm sorularınız için uzman ekibimize ulaşın.</p>
            </div>
            <div className="cta-band-iletisim">
              <TeklifCta urun={urun} />
              <a className="btn btn-cerceve" href="tel:902122112425">+90 212 211 24 25</a>
            </div>
          </div>
        </div>
      </section>

      {urun.cta.tip === "modal" && <TeklifModal />}
    </>
  );
}
