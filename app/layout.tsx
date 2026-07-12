import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

// Yazi tipi tasarimcinin temasiyla ayni (Instrument Sans)
const yaziTipi = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Hepon Sigorta | Hayatın Her Anında",
  description: "Hepon Sigorta Acenteliği online teklif platformu. DASK ve seyahat sağlık sigortasında dakikalar içinde teklif alın.",
};

const urunMenu = [
  { ad: "Trafik Sigortası", href: "/trafik-sigortasi/" },
  { ad: "Kasko Sigortası", href: "/kasko-sigortasi/" },
  { ad: "İMM Sigortası", href: "/imm-sigortasi/" },
  { ad: "DASK Sigortası", href: "/dask-sigortasi/" },
  { ad: "Seyahat Sağlık Sigortası", href: "/seyahat-saglik-sigortasi/" },
  { ad: "Tamamlayıcı Sağlık Sigortası", href: "/tamamlayici-saglik-sigortasi/" },
  { ad: "Yabancı Sağlık Sigortası", href: "/yabanci-saglik-sigortasi/" },
  { ad: "Ferdi Kaza Sigortası", href: "/ferdi-kaza-sigortasi/" },
  { ad: "Mesleki Sorumluluk Sigortaları", href: "/mesleki-sorumluluk-sigortalari/" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={yaziTipi.className}>
        <header className="topbar">
          <div className="wrap">
            <a href="/"><img src="/logo-heponla.png" alt="Heponla" /></a>
            <nav>
              <div className="menu-acilir">
                <a href="/#urunler">Sigorta Ürünleri <span className="ok">▾</span></a>
                <div className="menu-panel">
                  {urunMenu.map((u) => <a key={u.href} href={u.href}>{u.ad}</a>)}
                </div>
              </div>
              <a href="/hakkimizda/">Hakkımızda</a>
              <a href="/sss/">S.S.S</a>
              <a href="/iletisim/">İletişim</a>
              <a className="cta" href="/uyelik/">Üye Ol / Giriş Yap</a>
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <div>
              <img src="/logo-hepon-beyaz.svg" alt="Hepon Sigorta" />
              <p style={{ fontSize: 14, maxWidth: "36ch" }}>Hayatın Her Anında Hepon&apos;la. Teklif, poliçe ve hasar süreçlerinizde güvenilir çözüm ortağınız.</p>
            </div>
            <div>
              <h4>ÜRÜNLER</h4>
              <a href="/trafik-sigortasi/">Trafik Sigortası</a>
              <a href="/kasko-sigortasi/">Kasko Sigortası</a>
              <a href="/dask-sigortasi/">DASK Sigortası</a>
              <a href="/seyahat-saglik-sigortasi/">Seyahat Sağlık Sigortası</a>
              <a href="/tamamlayici-saglik-sigortasi/">Tamamlayıcı Sağlık Sigortası</a>
            </div>
            <div>
              <h4>KURUMSAL</h4>
              <a href="/hakkimizda/">Hakkımızda</a>
              <a href="/hizmetlerimiz/">Hizmetlerimiz</a>
              <a href="/sss/">S.S.S</a>
              <a href="/profil/">Profilim</a>
              <a href="/iletisim/">İletişim</a>
            </div>
            <div>
              <h4>İLETİŞİM</h4>
              <a href="tel:902122112425">+90 212 211 24 25</a>
              <a href="tel:905333290842">+90 533 329 08 42</a>
              <a href="mailto:info@heponsigorta.com">info@heponsigorta.com</a>
              <p style={{ fontSize: 13.5 }}>Mecidiyeköy Mh. Mecidiye Cd. Cansızoğlu Pasajı No: 7/3, Şişli, İstanbul</p>
            </div>
            <div className="telif">© 2026 Hepon Sigorta Acenteliği. Teklifler demo modundadır, gerçek poliçe teklifi değildir.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
