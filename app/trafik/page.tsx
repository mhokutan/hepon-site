import type { Metadata } from "next";
import TeklifModal from "../../components/TeklifModal";

export const metadata: Metadata = {
  title: "Trafik Sigortası | Hepon Sigorta",
  description: "Zorunlu trafik sigortası tekliflerini Hepon'la karşılaştırın, poliçenizi güvenle oluşturun.",
};

const uygunKisiler = [
  "Trafiğe kayıtlı motorlu araç sahipleri ve işletenleri",
  "Yeni araç satın alan veya mevcut poliçesi yenilenecek kişiler",
  "Poliçe bitiş tarihini takip edip kesintisiz güvence isteyen araç sahipleri",
  "Farklı şirket tekliflerini tek akışta değerlendirmek isteyen kullanıcılar",
];

const teminatlar = [
  "Karşı tarafın aracında veya malvarlığında oluşan maddi zararlar",
  "Kazaya bağlı yaralanma ve vefat nedeniyle doğabilecek bedeni zararlar",
  "Mevzuat ve poliçe genel şartları dahilindeki hukuki sorumluluklar",
  "Teminat limitleri ve kapsam, yürürlükteki düzenlemeler ile poliçe koşullarına göre uygulanır",
];

export default function Trafik() {
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap">
          <h1>Trafik Sigortası Tekliflerini Hepon&apos;la Karşılaştırın</h1>
          <p style={{ color: "#b9c6dd", marginTop: 10, maxWidth: "60ch" }}>
            Zorunlu trafik sigortanı dakikalar içinde karşılaştır, poliçeni güvenle oluştur.
          </p>
          <button className="btn hepon-teklif-trigger" data-product="trafik" type="button" style={{ marginTop: 22 }}>
            Hemen Teklif Al
          </button>
        </div>
      </section>

      <section className="bolum">
        <div className="wrap icerik">
          <h3>Trafik Sigortası nedir?</h3>
          <p>
            Zorunlu trafik sigortası, motorlu araç işleteninin üçüncü kişilere verebileceği bedeni ve maddi
            zararlara karşı yasal sorumluluğunu, poliçe ve mevzuatta belirlenen sınırlar dahilinde güvence
            altına alır. Hepon&apos;la, teklif alma sürecini dijitalleştirirken yalnızca fiyatı değil, poliçenin
            kapsamını ve ödeme seçeneklerini de anlaşılır biçimde değerlendirmenize yardımcı olur.
          </p>

          <h3>Trafik Sigortası kimler için uygundur?</h3>
          <div className="hizmet-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
            {uygunKisiler.map((k) => (
              <div key={k} className="hizmet"><h4>{k}</h4></div>
            ))}
          </div>

          <h3>Trafik Sigortası temel teminat çerçevesi</h3>
          <p className="not">
            Kesin kapsam, limit, muafiyet, bekleme süresi ve istisnalar teklif ekranı ile poliçe
            özel/genel şartlarından kontrol edilmelidir.
          </p>
          <div className="hizmet-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
            {teminatlar.map((t) => (
              <div key={t} className="hizmet"><p style={{ marginTop: 0 }}>{t}</p></div>
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
              <button className="btn hepon-teklif-trigger" data-product="trafik" type="button">Teklif Al</button>
              <a className="btn btn-cerceve" href="tel:902122112425">+90 212 211 24 25</a>
            </div>
          </div>
        </div>
      </section>

      <TeklifModal />
    </>
  );
}
