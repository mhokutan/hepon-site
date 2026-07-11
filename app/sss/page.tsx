"use client";
import { useState } from "react";

const sorular = [
  { s: "Neden sağlık sigortası yaptırmalıyım?", c: "Sağlık sigortası, beklenmedik sağlık sorunları ve kaza durumlarında karşılaşabileceğiniz yüksek tıbbi masrafların altından kalkmanıza yardımcı olur. Özel sağlık sigortası, devlet sağlık hizmetlerinin yanı sıra ekstra koruma ve daha geniş bir sağlık ağı sunar. Yüksek maliyetli tedaviler ve acil durumlar için finansal güvence oluşturur." },
  { s: "Araç sigortası yaptırmak zorunlu mu?", c: "Zorunlu trafik sigortası yasal bir zorunluluktur ve aracınızla üçüncü kişilere verebileceğiniz zararları karşılar. Kasko ise isteğe bağlıdır ve kendi aracınızın hasarlarını güvence altına alır." },
  { s: "Evim için hangi tür sigorta yaptırmalıyım?", c: "DASK (Zorunlu Deprem Sigortası) her konut için yasal zorunluluktur ve deprem hasarlarını karşılar. Konut sigortası ise yangın, hırsızlık, su baskını gibi ek riskleri kapsar. İkisini birlikte yaptırmak en kapsamlı korumayı sağlar." },
  { s: "Bireysel emeklilik sigortası neden yaptırmalıyım?", c: "Bireysel emeklilik, geleceğinizi güvence altına alır ve emeklilik döneminiz için sistemli bir birikim fırsatı sunar. Devlet katkısıyla birikiminiz daha hızlı büyür. Erken planlama ile rahat bir gelecek kurabilirsiniz." },
  { s: "Hayat sigortası neden yaptırmalıyım?", c: "Hayat sigortası, sizin ve sevdiklerinizin geleceğini güvence altına alır. Beklenmedik durumlar karşısında ailenize finansal koruma sağlayarak huzurunuzu artırır." },
  { s: "Konut sigortası neden yaptırmalıyım?", c: "Konut sigortası, evinizi yangın, hırsızlık, su baskını gibi risklere karşı korur. DASK sadece deprem hasarını karşılarken, konut sigortası çok daha geniş bir koruma sağlar." },
  { s: "Mesleki sorumluluk sigortası neden yaptırmalıyım?", c: "Mesleki faaliyetleriniz sırasında müşterilerinize verebileceğiniz zararlardan doğan tazminat taleplerine karşı sizi korur. Avukat, mühendis, mali müşavir gibi birçok meslek grubu için önemli bir güvencedir." },
  { s: "Sorumluluk sigortası neden yaptırmalıyım?", c: "Üçüncü kişilere verebileceğiniz zararlardan doğan yasal sorumluluklarınızı güvence altına alır. İşletmeniz veya faaliyetleriniz kaynaklı tazminat risklerine karşı finansal koruma sağlar." },
];

export default function SSS() {
  const [acik, setAcik] = useState<number | null>(0);
  return (
    <>
      <section className="sayfa-baslik">
        <div className="wrap"><h1>Sıkça Sorulan Sorular</h1></div>
      </section>
      <main className="bolum">
        <div className="wrap icerik">
          {sorular.map((m, i) => (
            <div className="sss-madde" key={i}>
              <button onClick={() => setAcik(acik === i ? null : i)}>
                {m.s} <span>{acik === i ? "−" : "+"}</span>
              </button>
              {acik === i && <div className="cevap">{m.c}</div>}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
