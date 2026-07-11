import Maskot from "../components/Maskot";

export default function Home() {
  return (
    <>
      <section className="hero" id="teklif">
        <div className="wrap">
          <div className="hero-ust">
            <h1>Hayatın Her Anında <em>Hepon&apos;la</em></h1>
            <p>Ürününü seç, bilgilerini gir, anlaşmalı sigorta şirketlerinden en uygun teklifi dakikalar içinde al.</p>
          </div>
          <div className="urun-kartlar hero-kartlar">
            <a className="urun-kart" href="/dask/">
              <div>
                <span className="etiket">ZORUNLU</span>
                <h3>DASK Deprem Sigortası</h3>
                <p>Evini deprem riskine karşı güvence altına al. UAVT kodunla dakikalar içinde teklif.</p>
                <span className="git">Teklif Al →</span>
              </div>
              <Maskot boy={150} tip="ev" />
            </a>
            <a className="urun-kart" href="/seyahat/">
              <div>
                <span className="etiket">VİZEYE UYGUN</span>
                <h3>Seyahat Sağlık Sigortası</h3>
                <p>Yurt dışı seyahatlerinde sağlık güvencen hazır olsun. Vize başvurusuna uygun poliçe.</p>
                <span className="git">Teklif Al →</span>
              </div>
              <Maskot boy={150} tip="bavul" />
            </a>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="wrap">
          <h2>Neden Hepon Sigorta?</h2>
          <p className="alt-baslik">Müşteri memnuniyetini önceliğimiz olarak görüyor, sigorta süreçlerini sizin için kolaylaştırıyoruz.</p>
          <div className="ozellikler">
            <div className="ozellik"><div className="ikon">🛡️</div><h3>Güven ve Güvence</h3><p>Uzun yıllara dayanan deneyim ve derin bilgi birikimiyle güvenilir hizmet.</p></div>
            <div className="ozellik"><div className="ikon">⚡</div><h3>Kolay ve Hızlı İşlem</h3><p>Karmaşık prosedürleri sizin için yönetiyor, hızlı çözümler sunuyoruz.</p></div>
            <div className="ozellik"><div className="ikon">💬</div><h3>Üstün Müşteri Hizmetleri</h3><p>İhtiyaç duyduğunuz her an profesyonel ekibimiz yanınızda.</p></div>
            <div className="ozellik"><div className="ikon">📋</div><h3>Kapsamlı Çözümler</h3><p>Bireysel ve kurumsal ihtiyaçlara özel geniş sigorta yelpazesi.</p></div>
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2>Diğer Hizmetlerimiz</h2>
          <p className="alt-baslik">Aşağıdaki ürünlerde uzman danışmanlarımız teklif sürecini sizin için yürütür. Arayın, dakikalar içinde dönüş yapalım.</p>
          <div className="hizmet-grid">
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Kasko</h4><p>Aracınıza gelebilecek hasarlara karşı tam koruma.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Zorunlu Trafik Sigortası</h4><p>Yasal zorunluluk, güvenli sürüş.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Tamamlayıcı Sağlık</h4><p>Özel hastanelerde ekstra masraf güvencesi.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Özel Sağlık Sigortası</h4><p>Geniş sağlık ağı, hızlı tedavi imkanı.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Bireysel Emeklilik</h4><p>Emeklilik dönemi için sistemli birikim.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Hayat Sigortası</h4><p>Sevdiklerinizin geleceğini güvence altına alın.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Konut Sigortası</h4><p>Eviniz için deprem ötesi kapsamlı koruma.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>İş Yeri Sigortası</h4><p>Yangın, hırsızlık, su baskını risklerine karşı.</p></a>
            <a className="hizmet" href="/hizmetlerimiz/"><h4>Mesleki Sorumluluk</h4><p>Avukat, mühendis, müşavir ve daha fazlası için.</p></a>
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <div>
              <h3>Sorunuz mu var? Hemen arayın.</h3>
              <p>Uzman ekibimiz hafta içi 09:00 - 17:30 arası yanınızda.</p>
            </div>
            <a className="btn" href="tel:902122112425">+90 212 211 24 25</a>
          </div>
        </div>
      </section>
    </>
  );
}
