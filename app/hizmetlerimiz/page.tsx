const gruplar = [
  { baslik: "Araç Sigortası", urunler: ["Kasko", "Zorunlu Trafik Sigortası", "Karayolu Yolcu Taşımacılığı Zorunlu Koltuk Ferdi Kaza", "Yeşil Kart Sigortası", "İhtiyari Mali Mesuliyet (İMM)"] },
  { baslik: "Seyahat Sağlık Sigortası", onlineLink: "/seyahat/", onlineYazi: "Online Teklif Al", urunler: ["Yurt Dışı Seyahat Sağlık Sigortası", "Vize Başvurusuna Uygun Poliçe", "Schengen, Tüm Avrupa ve Tüm Dünya Kapsamı"] },
  { baslik: "Sağlık Sigortası", urunler: ["Tamamlayıcı Sağlık Sigortası", "Özel Sağlık Sigortası", "Yabancı Özel Sağlık Sigortası"] },
  { baslik: "Konut Sigortaları", onlineLink: "/dask/", onlineYazi: "Online Teklif Al", urunler: ["DASK (Zorunlu Deprem Sigortası)", "Konut Sigortası"] },
  { baslik: "Bireysel Emeklilik", urunler: ["Bireysel Emeklilik Planları", "Otomatik Katılım Planları", "İşveren Grup Emeklilik Planları"] },
  { baslik: "Hayat Sigortaları", urunler: ["Kişisel Hayat Sigortası", "Grup Hayat Sigortası"] },
  { baslik: "İş Yeri Sigortası", urunler: ["İş Yeri Sigortası"] },
  { baslik: "Nakliyat ve Deniz Araçları", urunler: ["Yat Sigortası", "Deniz Araçları Sigortası", "Taşınan Emtia Sigortası"] },
  { baslik: "Mesleki Sorumluluk", urunler: ["Mali Müşavirler", "Avukatlar", "Mühendisler ve Mimarlar", "Yönetim Danışmanları", "Seyahat Acenteleri", "Medya Çalışanları", "Bilgi İşlem", "Sigorta Acenteleri", "Çeviri Büroları", "İnsan Kaynakları", "Çağrı Merkezleri", "Ekspertiz Hizmetleri"] },
  { baslik: "Sorumluluk Sigortaları", urunler: ["Zorunlu Mali Sorumluluk", "Taşımacılık Mali Sorumluluk", "Tehlikeli Maddeler", "TÜPGAZ Zorunlu Sorumluluk", "Çevre Kirliliği", "Özel Güvenlik", "Vale Sorumluluk", "Üçüncü Şahıs", "İşveren Mali Sorumluluk", "Ürün Sorumluluk", "Asansör Kazaları"] },
];

export default function Hizmetlerimiz() {
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap"><h1>Hizmetlerimiz</h1></div>
      </section>
      <main className="bolum">
        <div className="wrap">
          <p className="alt-baslik">Profesyonel sigorta danışmanlarımızla geleceğinizi koruyun. DASK ve Seyahat Sağlık ürünlerinde online teklif alabilir, diğer ürünlerde bize ulaşabilirsiniz.</p>
          <div className="hizmet-grid">
            {gruplar.map(g => (
              <div className="hizmet" key={g.baslik}>
                <h4>{g.baslik}</h4>
                <p>{g.urunler.join(", ")}</p>
                {g.onlineLink
                  ? <a className="btn" style={{ marginTop: 12, padding: "9px 16px", fontSize: 13.5 }} href={g.onlineLink}>{g.onlineYazi}</a>
                  : <a className="btn btn-gri" style={{ marginTop: 12, padding: "9px 16px", fontSize: 13.5, display: "inline-block", textDecoration: "none" }} href="/iletisim/">Bilgi Al</a>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
