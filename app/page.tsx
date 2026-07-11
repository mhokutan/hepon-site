import TeklifModal from "../components/TeklifModal";

type Urun = {
  ad: string;
  aciklama: string;
  ikon: string;
  etiket?: string;
  href?: string;      // sayfaya giden kartlar
  modal?: string;     // teklif modalini acan kartlar (data-product degeri)
};

const urunler: Urun[] = [
  { ad: "Trafik Sigortası", ikon: "🚗", etiket: "ZORUNLU", modal: "trafik",
    aciklama: "Zorunlu trafik sigortanı dakikalar içinde karşılaştır, poliçeni güvenle oluştur." },
  { ad: "Kasko Sigortası", ikon: "🛠️", href: "/iletisim/",
    aciklama: "Aracına gelebilecek hasarlara karşı tam koruma için danışmanlarımızla teklif al." },
  { ad: "İMM Sigortası", ikon: "📈", href: "/iletisim/",
    aciklama: "Trafik sigortası limitini aşan hasarlar için ek güvence seçeneklerini incele." },
  { ad: "Seyahat Sağlık Sigortası", ikon: "✈️", etiket: "VİZEYE UYGUN", href: "/seyahat/",
    aciklama: "Yurt dışı seyahatlerinde sağlık güvencen hazır olsun. Vize başvurusuna uygun poliçe." },
  { ad: "DASK Sigortası", ikon: "🏠", etiket: "ZORUNLU", href: "/dask/",
    aciklama: "Evini deprem riskine karşı güvence altına al. UAVT kodunla dakikalar içinde teklif." },
  { ad: "Yabancı Sağlık Sigortası", ikon: "🌍", href: "/iletisim/",
    aciklama: "İkamet izni başvurularına uygun, yabancılar için özel sağlık sigortası." },
  { ad: "Tamamlayıcı Sağlık Sigortası", ikon: "🏥", href: "/iletisim/",
    aciklama: "SGK anlaşmalı özel hastanelerde fark ücreti ödemeden tedavi imkanı." },
  { ad: "Ferdi Kaza Sigortası", ikon: "🦺", href: "/iletisim/",
    aciklama: "Beklenmedik kazalara karşı kendini ve sevdiklerini güvence altına al." },
  { ad: "Mesleki Sorumluluk Sigortaları", ikon: "⚖️", href: "/iletisim/",
    aciklama: "Avukat, mühendis, hekim, müşavir ve daha fazlası için mesleki güvence." },
];

const adimlar = [
  { no: 1, baslik: "Sigorta Türünü Seç", gorsel: "/adimlar/adim-1.png",
    metin: "İhtiyacına uygun sigorta ürününü seç, teklif akışını başlat." },
  { no: 2, baslik: "Bilgilerinizi Girin", gorsel: "/adimlar/adim-2.png",
    metin: "Teklif için gerekli birkaç kısa bilgiyi güvenle paylaş." },
  { no: 3, baslik: "Teklifleri Karşılaştırın", gorsel: "/adimlar/adim-3.png",
    metin: "Anlaşmalı şirketlerin tekliflerini fiyat ve teminat detaylarıyla karşılaştır." },
  { no: 4, baslik: "Poliçenizi Oluşturun", gorsel: "/adimlar/adim-4.png",
    metin: "Sana uygun teklifi seç, poliçeni güvenli şekilde oluştur." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-ust">
            <h1>Sigorta Tekliflerini <em>Hepon&apos;la</em> Karşılaştır, Poliçeni Güvenle Oluştur</h1>
            <p>Trafik, kasko, DASK, sağlık, seyahat ve mesleki sorumluluk sigortalarında ihtiyacına uygun teklifleri online al. Hepon&apos;la poliçeni hızlı, güvenli ve danışman destekli şekilde oluştur.</p>
            <div className="hero-btnlar" style={{ justifyContent: "center" }}>
              <a className="btn" href="#urunler">Hemen Teklif Al</a>
              <a className="btn btn-cerceve" href="#nasil-calisir">Nasıl Çalışır?</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum" id="urunler">
        <div className="wrap">
          <h2>Sigorta Ürünlerimiz</h2>
          <p className="alt-baslik">İhtiyacına uygun ürünü seç, teklifini dakikalar içinde al.</p>
          <div className="urun-grid">
            {urunler.map((u) =>
              u.modal ? (
                <button key={u.ad} className="urun-kutu hepon-teklif-trigger" data-product={u.modal} type="button">
                  <div className="ikon">{u.ikon}</div>
                  {u.etiket && <span className="etiket">{u.etiket}</span>}
                  <h4>{u.ad}</h4>
                  <p>{u.aciklama}</p>
                  <span className="git">Teklif Al →</span>
                </button>
              ) : (
                <a key={u.ad} className="urun-kutu" href={u.href}>
                  <div className="ikon">{u.ikon}</div>
                  {u.etiket && <span className="etiket">{u.etiket}</span>}
                  <h4>{u.ad}</h4>
                  <p>{u.aciklama}</p>
                  <span className="git">Teklif Al →</span>
                </a>
              )
            )}
            <a className="urun-kutu urun-kutu-cta" href="/iletisim/">
              <div className="ikon">💙</div>
              <h4>Hayatın Her Anında Hepon&apos;la</h4>
              <p>Aradığın ürünü bulamadın mı? Uzman danışmanlarımız tüm sigorta ihtiyaçların için yanında.</p>
              <span className="git">İletişime Geç →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Anlaşmalı Sigorta Şirketleri</h2>
          <p className="alt-baslik">Türkiye&apos;nin önde gelen sigorta şirketleriyle çalışıyoruz.</p>
          <div className="anlasmali-serit">
            <img src="/anlasmali/turkiye-sigorta.png" alt="Türkiye Sigorta" />
            <img src="/anlasmali/sompo-sigorta.png" alt="Sompo Sigorta" />
            <img src="/anlasmali/hepiyi-sigorta.png" alt="Hepiyi Sigorta" />
            <img src="/anlasmali/koru-sigorta.png" alt="Koru Sigorta" />
          </div>
        </div>
      </section>

      <section className="bolum" id="nasil-calisir" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Hepon&apos;la Nasıl Çalışır?</h2>
          <p className="alt-baslik">Sigorta teklifini birkaç adımda al, karşılaştır ve poliçeni güvenle oluştur.</p>
          <div className="adim-grid">
            {adimlar.map((a) => (
              <div key={a.no} className="adim-kart">
                <img src={a.gorsel} alt={a.baslik} />
                <div className="adim-no">{a.no}</div>
                <h4>{a.baslik}</h4>
                <p>{a.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Neden Hepon&apos;la?</h2>
          <p className="alt-baslik">Online sigorta deneyimini Hepon danışmanlığıyla birleştirerek hızlı, güvenli ve anlaşılır bir süreç sunar.</p>
          <div className="ozellikler">
            <div className="ozellik"><div className="ikon">⚡</div><h3>Online Teklif Kolaylığı</h3><p>Sigorta tekliflerini birkaç adımda online alın.</p></div>
            <div className="ozellik"><div className="ikon">📋</div><h3>Teminatları Karşılaştırma</h3><p>Sadece fiyatı değil, kapsam ve detayları da değerlendirin.</p></div>
            <div className="ozellik"><div className="ikon">💬</div><h3>Hepon Danışman Desteği</h3><p>Karar verirken veya poliçe sonrası süreçlerde destek alın.</p></div>
            <div className="ozellik"><div className="ikon">🛡️</div><h3>Güvenli Poliçe Süreci</h3><p>Bilgilerinizi güvenli paylaşın, poliçenizi kontrollü oluşturun.</p></div>
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
              <a className="btn" href="tel:902122112425">+90 212 211 24 25</a>
              <a className="btn btn-cerceve" href="mailto:destek@heponsigorta.com">destek@heponsigorta.com</a>
            </div>
          </div>
        </div>
      </section>

      <TeklifModal />
    </>
  );
}
