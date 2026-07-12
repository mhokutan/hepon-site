import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

// Yazi tipi tasarimcinin temasiyla ayni (Instrument Sans)
const yaziTipi = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Hepon Sigorta | Hayatın Her Anında",
  description: "Hepon Sigorta Acenteliği online teklif platformu. DASK ve seyahat sağlık sigortasında dakikalar içinde teklif alın.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={yaziTipi.className}>
        <header className="topbar">
          <div className="wrap">
            <a href="/"><img src="/logo.png" alt="Hepon Sigorta" /></a>
            <nav>
              <a href="/">Ana Sayfa</a>
              <a href="/hakkimizda/">Hakkımızda</a>
              <a href="/hizmetlerimiz/">Hizmetlerimiz</a>
              <a href="/sss/">S.S.S</a>
              <a href="/iletisim/">İletişim</a>
              <a className="cta" href="/profil/">Giriş Yap / Üye Ol</a>
              <span className="demo-etiket" style={{ marginLeft: 10 }}>DEMO</span>
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <div>
              <img src="/logo-beyaz.png" alt="Hepon Sigorta" />
              <p style={{ fontSize: 14, maxWidth: "36ch" }}>Hayatın Her Anında Hepon Sigorta. Güvenli ve huzurlu bir gelecek için yanınızdayız.</p>
            </div>
            <div>
              <h4>MENÜ</h4>
              <a href="/">Ana Sayfa</a>              
              <a href="/hakkimizda/">Hakkımızda</a>
              <a href="/hizmetlerimiz/">Hizmetlerimiz</a>
              <a href="/sss/">S.S.S</a>
              <a href="/iletisim/">İletişim</a>
            </div>
            <div>
              <h4>İLETİŞİM</h4>
              <a href="tel:902122112425">+90 212 211 24 25</a>
              <a href="tel:905333290842">+90 533 329 08 42</a>
              <a href="mailto:info@heponsigorta.com">info@heponsigorta.com</a>
              <p style={{ fontSize: 13.5 }}>Mecidiyeköy Mh. Mecidiye Cd. Cansızoğlu Pasajı No: 7/3, Şişli, İstanbul</p>
            </div>
            <div className="telif">Hepon Sigorta Acenteliği. Demo sürümüdür, gerçek poliçe teklifi değildir.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
