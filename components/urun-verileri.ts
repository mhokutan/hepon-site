// Urun ic sayfalarinin icerigi. Kaynak: tasarimcinin hazirladigi sayfalar
// (1217253.eu14.myftpupload.com staging sitesinden 2026-07-11'de alindi).

export type UrunIcerik = {
  slug: string;
  ad: string;
  h1: string;
  heroAlt: string;
  nedir: string;
  kimlerBaslik: string;
  kimler: string[];
  teminatBaslik: string;
  teminatNot: string;
  teminatlar: string[];
  // teklif CTA'si: modal (demo teklif modali), link (calisan akis) veya iletisim
  cta: { tip: "modal"; urunKodu: string } | { tip: "link"; href: string } | { tip: "iletisim" };
};

export const urunVerileri: Record<string, UrunIcerik> = {
  "trafik-sigortasi": {
    slug: "trafik-sigortasi",
    ad: "Trafik Sigortası",
    h1: "Trafik Sigortası Tekliflerini Hepon'la Karşılaştırın",
    heroAlt: "Aracınız için zorunlu trafik sigortası teklifini birkaç adımda alın; fiyat, teminat ve ödeme seçeneklerini inceleyerek poliçenizi güvenle oluşturun.",
    nedir: "Zorunlu trafik sigortası, motorlu araç işleteninin üçüncü kişilere verebileceği bedeni ve maddi zararlara karşı yasal sorumluluğunu, poliçe ve mevzuatta belirlenen sınırlar dahilinde güvence altına alır. Hepon'la, teklif alma sürecini dijitalleştirirken yalnızca fiyatı değil, poliçenin kapsamını ve ödeme seçeneklerini de anlaşılır biçimde değerlendirmenize yardımcı olur.",
    kimlerBaslik: "Trafik Sigortası kimler için uygundur?",
    kimler: [
      "Trafiğe kayıtlı motorlu araç sahipleri ve işletenleri",
      "Yeni araç satın alan veya mevcut poliçesi yenilenecek kişiler",
      "Poliçe bitiş tarihini takip edip kesintisiz güvence isteyen araç sahipleri",
      "Farklı şirket tekliflerini tek akışta değerlendirmek isteyen kullanıcılar",
    ],
    teminatBaslik: "Trafik Sigortası temel teminat çerçevesi",
    teminatNot: "Kesin kapsam, limit, muafiyet, bekleme süresi ve istisnalar teklif ekranı ile poliçe özel/genel şartlarından kontrol edilmelidir.",
    teminatlar: [
      "Karşı tarafın aracında veya malvarlığında oluşan maddi zararlar",
      "Kazaya bağlı yaralanma ve vefat nedeniyle doğabilecek bedeni zararlar",
      "Mevzuat ve poliçe genel şartları dahilindeki hukuki sorumluluklar",
      "Teminat limitleri ve kapsam, yürürlükteki düzenlemeler ile poliçe koşullarına göre uygulanır",
    ],
    cta: { tip: "modal", urunKodu: "trafik" },
  },
  "kasko-sigortasi": {
    slug: "kasko-sigortasi",
    ad: "Kasko Sigortası",
    h1: "Aracınıza Uygun Kasko Sigortası Tekliflerini Karşılaştırın",
    heroAlt: "Aracınızın değerine ve kullanım ihtiyaçlarınıza uygun kasko seçeneklerini inceleyin; teminatları anlayarak doğru poliçeyi seçin.",
    nedir: "Kasko sigortası, aracınızı poliçede belirtilen kaza, çarpma, çalınma, yangın ve ek risklere karşı güvence altına alan isteğe bağlı bir sigorta ürünüdür. Her kasko poliçesi aynı kapsamı sunmaz. Bu nedenle yalnızca prim tutarını değil; muafiyetleri, servis seçimini, ikame araç ve asistans gibi ek hizmetleri de karşılaştırmak gerekir.",
    kimlerBaslik: "Kasko Sigortası kimler için uygundur?",
    kimler: [
      "Aracını beklenmedik hasarlara karşı korumak isteyenler",
      "Yeni, yüksek değerli veya finansmanla alınmış araç sahipleri",
      "Servis, ikame araç ve asistans hizmetlerine önem veren kullanıcılar",
      "Mevcut kasko poliçesini yenilemek veya kapsamını geliştirmek isteyenler",
    ],
    teminatBaslik: "Kasko Sigortası temel teminat çerçevesi",
    teminatNot: "Kesin kapsam, limit, muafiyet ve istisnalar seçilen ürünün özel ve genel şartlarından kontrol edilmelidir.",
    teminatlar: [
      "Çarpma, çarpışma, devrilme gibi poliçede tanımlanan araç hasarları",
      "Çalınma veya çalınmaya teşebbüs riskleri",
      "Yangın ve poliçeye eklenen doğal afet teminatları",
      "Teminatlar ve istisnalar seçilen ürünün özel ve genel şartlarına göre değişir",
    ],
    cta: { tip: "iletisim" },
  },
  "imm-sigortasi": {
    slug: "imm-sigortasi",
    ad: "İMM Sigortası",
    h1: "İMM Sigortası ile Sorumluluk Limitinizi Güçlendirin",
    heroAlt: "Trafik sigortası limitlerinin yetersiz kalabileceği büyük hasarlara karşı ek sorumluluk güvencesi oluşturun.",
    nedir: "İhtiyari Mali Mesuliyet (İMM) Sigortası, bir trafik kazasında üçüncü kişilere verilen zararın zorunlu trafik sigortası limitlerini aşması halinde devreye girebilen ek bir sorumluluk güvencesidir. Özellikle yüksek maliyetli araçların ve ciddi bedeni zararların bulunduğu kazalarda, daha yüksek limit seçimi kişisel finansal riski azaltmaya yardımcı olabilir.",
    kimlerBaslik: "İMM Sigortası kimler için uygundur?",
    kimler: [
      "Trafik sigortası limitlerinin üzerinde ek koruma isteyen sürücüler",
      "Yoğun şehir trafiğinde araç kullananlar",
      "Yüksek maliyetli araçlarla aynı trafikte bulunan kullanıcılar",
      "Kasko poliçesine ek sorumluluk teminatı eklemek isteyenler",
    ],
    teminatBaslik: "İMM Sigortası temel teminat çerçevesi",
    teminatNot: "Kapsam, muafiyet ve limitler şirket ve poliçe şartlarına göre değişebilir.",
    teminatlar: [
      "Trafik sigortası limitini aşan üçüncü kişi maddi zararları",
      "Poliçede seçilmişse bedeni zararlar ve manevi tazminat teminatları",
      "Seçilen limite veya ürün yapısına göre ek hukuki sorumluluklar",
      "Kapsam, muafiyet ve limitler şirket/poliçe şartlarına göre değişebilir",
    ],
    cta: { tip: "iletisim" },
  },
  "dask-sigortasi": {
    slug: "dask-sigortasi",
    ad: "DASK Sigortası",
    h1: "DASK Poliçenizi Online ve Güvenle Oluşturun",
    heroAlt: "Konutunuzu deprem ve deprem kaynaklı belirli risklere karşı Zorunlu Deprem Sigortası ile güvence altına alın.",
    nedir: "Zorunlu Deprem Sigortası, kapsam dahilindeki meskenlerde deprem ve deprem sonucu meydana gelen belirli zararları poliçe genel şartları ve azami teminatlar çerçevesinde güvence altına alır. DASK bina yapısını esas alır; ev eşyaları ve poliçe kapsamı dışındaki riskler için konut sigortası ayrıca değerlendirilmelidir.",
    kimlerBaslik: "DASK kimler için uygundur?",
    kimler: [
      "Tapuya kayıtlı ve kapsam dahilindeki mesken sahipleri",
      "Konut kredisi, abonelik veya tapu işlemleri için geçerli poliçe ihtiyacı olanlar",
      "Mevcut DASK poliçesini yenilemek isteyen ev sahipleri",
      "Konutunu deprem riskine karşı temel güvenceye almak isteyenler",
    ],
    teminatBaslik: "DASK temel teminat çerçevesi",
    teminatNot: "Kesin kapsam ve limitler poliçe genel şartlarından kontrol edilmelidir.",
    teminatlar: [
      "Depremin doğrudan neden olduğu bina zararları",
      "Deprem sonucu yangın, infilak, yer kayması ve tsunami kaynaklı bina zararları",
      "Poliçe genel şartlarında belirtilen yapı bölümleri ve limitler",
      "Eşya, kira kaybı ve alternatif ikamet gibi riskler için konut sigortası gerekebilir",
    ],
    cta: { tip: "link", href: "/dask/" },
  },
  "seyahat-saglik-sigortasi": {
    slug: "seyahat-saglik-sigortasi",
    ad: "Seyahat Sağlık Sigortası",
    h1: "Seyahatiniz İçin Sağlık Sigortası Teklifini Online Alın",
    heroAlt: "Yolculuğunuz sırasında karşılaşabileceğiniz acil sağlık giderleri ve seyahat riskleri için uygun güvenceyi seçin.",
    nedir: "Seyahat sağlık sigortası, yurt içi veya yurt dışı seyahat sırasında ortaya çıkabilecek ani hastalık, kaza ve poliçede belirtilen asistans ihtiyaçlarına karşı güvence sunar. Vize başvurularında istenen kapsam, süre ve bölge şartları ülkeye ve başvuru türüne göre değişebileceğinden poliçe seçimi seyahat planına göre yapılmalıdır.",
    kimlerBaslik: "Seyahat Sağlık Sigortası kimler için uygundur?",
    kimler: [
      "Yurt dışına turistik, iş veya eğitim amacıyla seyahat edenler",
      "Vize başvurusu için geçerli poliçe belgesi sunması gerekenler",
      "Yurt içi seyahatlerinde acil sağlık ve asistans desteği isteyenler",
      "Tek veya çoklu seyahat planı bulunan kişiler",
    ],
    teminatBaslik: "Seyahat Sağlık Sigortası temel teminat çerçevesi",
    teminatNot: "Coğrafi bölge, seyahat süresi, yaş ve teminat limitleri ürüne göre değişebilir.",
    teminatlar: [
      "Ani hastalık veya kaza nedeniyle acil tıbbi tedavi giderleri",
      "Tıbbi nakil, asistans ve gerektiğinde ülkeye dönüş hizmetleri",
      "Poliçeye göre bagaj, seyahat iptali veya gecikme gibi ek teminatlar",
      "Coğrafi bölge, seyahat süresi, yaş ve teminat limitleri ürüne göre değişebilir",
    ],
    cta: { tip: "link", href: "/seyahat/" },
  },
  "yabanci-saglik-sigortasi": {
    slug: "yabanci-saglik-sigortasi",
    ad: "Yabancı Sağlık Sigortası",
    h1: "İkamet İzni İçin Yabancı Sağlık Sigortası Teklifi Alın",
    heroAlt: "Türkiye'de ikamet izni başvurunuz için gerekli süreyi kapsayan uygun sağlık sigortası seçeneklerini karşılaştırın.",
    nedir: "Yabancı sağlık sigortası, Türkiye'de ikamet izni başvurusunda bulunan yabancıların geçerli sağlık sigortası şartını karşılamaya yönelik ürünlerden biridir. Poliçenin istenen ikamet süresini kapsaması, başvuru sahibinin yaşına ve güncel resmi koşullara uygun olması gerekir. Başvuru türüne göre farklı geçerli sağlık güvenceleri de kabul edilebilir.",
    kimlerBaslik: "Yabancı Sağlık Sigortası kimler için uygundur?",
    kimler: [
      "Türkiye'de kısa veya uzun dönem ikamet iznine başvuran yabancılar",
      "Mevcut ikamet iznini uzatırken sağlık sigortası belgesi sunacak kişiler",
      "Aile ikamet izni veya diğer uygun başvuru türlerinde poliçe ihtiyacı olanlar",
      "Türkçe veya İngilizce destekle poliçe oluşturmak isteyen yabancılar",
    ],
    teminatBaslik: "Yabancı Sağlık Sigortası temel teminat çerçevesi",
    teminatNot: "Başvuruda kabul edilecek belge ve sigorta türleri güncel resmi kurallardan kontrol edilmelidir.",
    teminatlar: [
      "Ayakta ve yatarak tedavi teminatları ürün şartlarına göre sunulabilir",
      "Poliçe dönemi, ikamet başvurusunda talep edilen süreyi kapsamalıdır",
      "Yaş, mevcut hastalık, bekleme süresi ve limitler şirkete göre değişebilir",
      "Başvuruda kabul edilecek belge ve sigorta türleri güncel resmi kurallardan kontrol edilmelidir",
    ],
    cta: { tip: "iletisim" },
  },
  "tamamlayici-saglik-sigortasi": {
    slug: "tamamlayici-saglik-sigortasi",
    ad: "Tamamlayıcı Sağlık Sigortası",
    h1: "Tamamlayıcı Sağlık Sigortası Tekliflerini Karşılaştırın",
    heroAlt: "SGK kapsamınızı, anlaşmalı özel sağlık kuruluşlarında kullanılabilen tamamlayıcı güvenceyle destekleyin.",
    nedir: "Tamamlayıcı Sağlık Sigortası (TSS), SGK kapsamındaki kişilerin sigorta şirketinin anlaşmalı özel sağlık kuruluşlarında poliçe şartları dahilinde sağlık hizmeti almasına yardımcı olan bir üründür. Ayakta ve yatarak tedavi paketleri, hastane ağı, adet limitleri, katılım uygulamaları ve bekleme süreleri şirketlere göre farklılaşabilir.",
    kimlerBaslik: "Tamamlayıcı Sağlık Sigortası kimler için uygundur?",
    kimler: [
      "SGK güvencesi bulunan ve özel hastane erişimini artırmak isteyenler",
      "Ailesi için daha öngörülebilir sağlık harcaması planlamak isteyenler",
      "Ayakta ve yatarak tedavi seçeneklerini birlikte değerlendiren kişiler",
      "Mevcut TSS poliçesini yenilemek veya hastane ağını karşılaştırmak isteyenler",
    ],
    teminatBaslik: "Tamamlayıcı Sağlık Sigortası temel teminat çerçevesi",
    teminatNot: "Paket içerikleri, limitler ve bekleme süreleri şirketlere göre farklılaşabilir.",
    teminatlar: [
      "Yatarak tedavi, ameliyat ve hastane hizmetleri ürün şartlarına göre",
      "Ayakta muayene, tahlil ve görüntüleme hizmetleri seçilen pakete göre",
      "Anlaşmalı kurum ağı ve poliçede belirtilen sağlık hizmetleri",
      "Doğum, diş, check-up veya psikolojik destek gibi ek paketler ürüne göre sunulabilir",
    ],
    cta: { tip: "iletisim" },
  },
  "ferdi-kaza-sigortasi": {
    slug: "ferdi-kaza-sigortasi",
    ad: "Ferdi Kaza Sigortası",
    h1: "Beklenmedik Kazalara Karşı Ferdi Kaza Güvencesi",
    heroAlt: "Kaza sonucu oluşabilecek vefat, sürekli sakatlık ve seçilen ek risklere karşı finansal güvence oluşturun.",
    nedir: "Ferdi kaza sigortası, sigortalının poliçe süresi içinde karşılaşabileceği ani ve harici kazalar sonucunda vefat veya sürekli sakatlık gibi risklere karşı belirlenen limitlerle güvence sağlar. Ürün yapısına göre tedavi masrafları, gündelik tazminat veya asistans hizmetleri eklenebilir.",
    kimlerBaslik: "Ferdi Kaza Sigortası kimler için uygundur?",
    kimler: [
      "Kendisi ve ailesi için kaza kaynaklı finansal koruma isteyenler",
      "Aktif yaşam süren, sık seyahat eden veya riskli işlerde çalışan kişiler",
      "Kredi veya gelir devamlılığına yönelik ek güvence arayanlar",
      "Çalışanları için grup ferdi kaza çözümü düşünen işletmeler",
    ],
    teminatBaslik: "Ferdi Kaza Sigortası temel teminat çerçevesi",
    teminatNot: "Teminatlar ve limitler seçilen ürüne göre değişir; poliçe şartlarından kontrol edilmelidir.",
    teminatlar: [
      "Kaza sonucu vefat teminatı",
      "Kaza sonucu sürekli sakatlık teminatı",
      "Poliçeye göre tedavi masrafları veya gündelik tazminat",
      "Asistans ve ek hizmetler ürün seçeneklerine göre",
    ],
    cta: { tip: "iletisim" },
  },
  "mesleki-sorumluluk-sigortalari": {
    slug: "mesleki-sorumluluk-sigortalari",
    ad: "Mesleki Sorumluluk Sigortaları",
    h1: "Mesleğinize Uygun Sorumluluk Sigortası Çözümünü Bulun",
    heroAlt: "Mesleki faaliyetiniz sırasında doğabilecek hata, ihmal ve tazminat taleplerine karşı uygun güvenceyi yapılandırın.",
    nedir: "Mesleki sorumluluk sigortaları, profesyonel hizmet sunan kişi veya işletmelerin hata, ihmal, eksik hizmet veya mesleki yükümlülük ihlali iddiaları nedeniyle karşılaşabileceği tazminat ve savunma giderlerine karşı güvence sağlamayı amaçlar. Ürün, meslek grubuna ve mevzuata göre özel koşullarla düzenlenir.",
    kimlerBaslik: "Mesleki Sorumluluk Sigortaları kimler için uygundur?",
    kimler: [
      "Hekimler ve sağlık profesyonelleri",
      "Avukatlar, mali müşavirler, danışmanlar ve mühendisler",
      "Mimarlar, yazılım/teknoloji hizmet sağlayıcıları ve diğer profesyoneller",
      "Müşterilerine uzmanlık hizmeti sunan şirket ve ekipler",
    ],
    teminatBaslik: "Mesleki Sorumluluk Sigortaları temel teminat çerçevesi",
    teminatNot: "Geçmişe etkili tarih, bildirim esaslı yapı ve coğrafi kapsam gibi teknik hükümler ürüne göre değişir.",
    teminatlar: [
      "Mesleki hata veya ihmal iddiasına bağlı tazminat talepleri",
      "Poliçe kapsamında hukuki savunma ve yargılama giderleri",
      "Üçüncü kişilerin mali zararlarına ilişkin sorumluluklar",
      "Geçmişe etkili tarih, bildirim esaslı yapı ve coğrafi kapsam gibi teknik hükümler",
    ],
    cta: { tip: "iletisim" },
  },
};
