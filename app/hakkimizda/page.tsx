import Maskot from "../../components/Maskot";

export default function Hakkimizda() {
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap"><h1>Hakkımızda</h1></div>
      </section>
      <main className="bolum">
        <div className="wrap icerik">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Maskot boy={160} />
          </div>
          <h3>Hayatın Her Anında Hepon&apos;la</h3>
          <p>Hepon Sigorta Acenteliği olarak, müşterilerimizin yaşamlarının her aşamasında yanlarında olmayı ve onlara güven veren bir kalkan sağlamayı amaçlıyoruz. Müşteri memnuniyetini her zaman önceliğimiz olarak görüyor, sigorta süreçlerini kolaylaştırarak ve müşteri hizmetlerini en üst seviyeye çıkararak müşterilerimizin yanında yer alıyoruz.</p>
          <h3>Güven ve Güvence</h3>
          <p>Sigortacılık sektöründeki uzun yıllara dayanan deneyimimiz ve derin bilgi birikimimizle, müşterilerimize güvenilir hizmetler sunmaktayız. Hepon olarak, her adımda müşterilerimizin yanında olmayı taahhüt ediyoruz.</p>
          <h3>Kolay ve Hızlı İşlem</h3>
          <p>Sigorta süreçlerini müşteri odaklı bir yaklaşımla basitleştiriyor, karmaşık prosedürleri sizin için yönetiyor ve hızlı, etkili çözümler sunuyoruz.</p>
          <h3>Üstün Müşteri Hizmetleri</h3>
          <p>Hepon&apos;un profesyonel müşteri hizmetleri ekibi, ihtiyaç duyduğunuz her an yanınızdadır. Sorularınıza yanıt veriyor, taleplerinize hızlıca çözüm üretiyoruz.</p>
          <h3>Kapsamlı Sigorta Çözümleri</h3>
          <p>Bireysel ve kurumsal ihtiyaçlarınıza yönelik geniş kapsamlı sigorta çözümleri sunuyoruz. Sağlık, hayat, araç, konut ve daha fazlası için kapsamlı ve özelleştirilmiş seçenekler sunmaktayız.</p>
          <h3>Hepon ile Güvende Kalın</h3>
          <p>Müşterilerimizle kurduğumuz güçlü bağlar ve sunduğumuz yenilikçi sigorta çözümleriyle, yaşamınızın her anında yanınızda olmayı sürdürüyoruz. Güvenli ve huzurlu bir gelecek için Hepon Sigorta Acenteliği&apos;ni tercih edin.</p>
        </div>
      </main>
    </>
  );
}
