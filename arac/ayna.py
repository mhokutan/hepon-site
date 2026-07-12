#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tasarimcinin staging sitesini (myftpupload) bizim siteye aynalar.

Kullanim:
  python3 arac/ayna.py            # staging'den indirir, donusturur, public/ altina yazar
  python3 arac/ayna.py --indirme  # indirmeyi atlar, KAYNAK_DIZIN'deki mevcut html'leri kullanir

Sonrasinda: npm run build && sudo cp -r out/* /var/www/hepon/
"""
import os, re, sys, subprocess

BASE = 'https://1217253.eu14.myftpupload.com'
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # hepon-site/
PUB = os.path.join(KOK, 'public')
KAYNAK_DIZIN = '/tmp/hepon-ayna-kaynak'

# staging_slug -> (yerel_dizin, sayfa_basligi, cta_tipi)
# cta: ('modal', urun_kodu) demo teklif modali | ('akis', dosya, yedek_href) gercek API modali
#      ('link', href) duz baglanti | None (ozel sayfa, CTA islemi yok)
SAYFALAR = {
    '': ('', 'Hepon Sigorta | Hayatın Her Anında', None),
    'trafik-sigortasi': ('trafik-sigortasi', 'Trafik Sigortası | Hepon Sigorta', ('modal', 'trafik')),
    'kasko-sigortasi': ('kasko-sigortasi', 'Kasko Sigortası | Hepon Sigorta', ('modal', 'kasko')),
    'imm-sigortasi': ('imm-sigortasi', 'İMM Sigortası | Hepon Sigorta', ('modal', 'imm')),
    'tamamlayici-saglik-sigortasi': ('tamamlayici-saglik-sigortasi', 'Tamamlayıcı Sağlık Sigortası | Hepon Sigorta', ('modal', 'tss')),
    'dask': ('dask-sigortasi', 'DASK Sigortası | Hepon Sigorta', ('akis', 'dask', '/dask/')),
    'seyahat-saglik-sigortasi': ('seyahat-saglik-sigortasi', 'Seyahat Sağlık Sigortası | Hepon Sigorta', ('akis', 'seyahat', '/seyahat/')),
    'yabanci-saglik-sigortasi': ('yabanci-saglik-sigortasi', 'Yabancı Sağlık Sigortası | Hepon Sigorta', ('link', '/iletisim/')),
    'ferdi-kaza-sigortasi': ('ferdi-kaza-sigortasi', 'Ferdi Kaza Sigortası | Hepon Sigorta', ('link', '/iletisim/')),
    'mesleki-sorumluluk-sigortalari': ('mesleki-sorumluluk-sigortalari', 'Mesleki Sorumluluk Sigortaları | Hepon Sigorta', ('link', '/iletisim/')),
    'uyelik': ('uyelik', 'Üyelik | Hepon Sigorta', None),
    'hakkimizda': ('hakkimizda', 'Hakkımızda | Hepon Sigorta', None),
    'hesabim': ('hesabim', 'Hesabım | Hepon Sigorta', ('js', 'hesabim')),
    'yonetim': ('yonetim', 'Yönetim | Hepon Sigorta', ('js', 'yonetim')),
}

# ana sayfa kartlari: data-product -> hedef sayfa
KART_HEDEF = {
    'trafik': '/trafik-sigortasi/', 'kasko': '/kasko-sigortasi/', 'imm': '/imm-sigortasi/',
    'tss': '/tamamlayici-saglik-sigortasi/', 'dask': '/dask-sigortasi/',
    'seyahat-saglik': '/seyahat-saglik-sigortasi/', 'yabanci-saglik': '/yabanci-saglik-sigortasi/',
    'ferdi-kaza': '/ferdi-kaza-sigortasi/', 'mesleki-sorumluluk': '/mesleki-sorumluluk-sigortalari/',
}

def sayfa_linki(yol):
    if not yol or yol == '/':
        return '/'
    for s, (yerel, _b, _c) in SAYFALAR.items():
        if s and yol == f'/{s}/':
            return f'/{yerel}/'
    for on, hedef in [('/contact/', '/iletisim/'), ('/book-a-discovery-call/', '/iletisim/'),
                      ('/uyelik/', '/uyelik/'), ('/faq/', '/sss/'), ('/hakkimizda', '/hakkimizda/'),
                      ('/about', '/hakkimizda/'), ('/services', '/#urunler'), ('/industries', '/hizmetlerimiz/'),
                      ('/ai-micro-saas/', '/hizmetlerimiz/'), ('/ai-trainers/', '/hizmetlerimiz/'),
                      ('/resources', '/sss/'), ('/articles-insights/', '/sss/'), ('/category', '/sss/'),
                      ('/terms-of-service/', '/iletisim/'), ('/privacy-policy/', '/iletisim/'),
                      ('/cookie-policy/', '/iletisim/')]:
        if yol.startswith(on):
            return hedef
    return '/'

FOOTER_TABLO = [
    ('Automations that ship & keep running.', "Hayatın Her Anında Hepon'la", None),
    ('Automations that ship &amp; keep running.', "Hayatın Her Anında Hepon'la", None),
    ('We design and deploy AI + workflow automations that help teams work smarter, not harder.',
     'Teklif, poliçe ve hasar süreçlerinizde güvenilir çözüm ortağınız.', None),
    ('Support Triage &amp; Ticketing', 'Kasko Sigortası', '/kasko-sigortasi/'),
    ('Support Triage & Ticketing', 'Kasko Sigortası', '/kasko-sigortasi/'),
    ('Internal Tools &amp; Agents', 'DASK Sigortası', '/dask-sigortasi/'),
    ('Internal Tools & Agents', 'DASK Sigortası', '/dask-sigortasi/'),
    ('Data Pipelines', 'Seyahat Sağlık Sigortası', '/seyahat-saglik-sigortasi/'),
    ('Support &amp; Monitoring', 'Tamamlayıcı Sağlık Sigortası', '/tamamlayici-saglik-sigortasi/'),
    ('Support & Monitoring', 'Tamamlayıcı Sağlık Sigortası', '/tamamlayici-saglik-sigortasi/'),
    ('Who we are', 'Hakkımızda', '/hakkimizda/'),
    ('Case Studies', 'Hizmetlerimiz', '/hizmetlerimiz/'),
    ('Leadership', 'S.S.S', '/sss/'),
    ('Careers', 'Profilim', '/profil/'),
    ('Contact', 'İletişim', '/iletisim/'),
    ('Book a discovery call', 'Hemen Teklif Al', '/iletisim/'),
    ('1-800-356-8933', '+90 212 211 24 25', 'tel:902122112425'),
    ('hello@aifusuinx.com', 'info@heponsigorta.com', 'mailto:info@heponsigorta.com'),
    ('Services', 'Ürünler', None),
    ('Comapny', 'Kurumsal', None),
    ('Social', 'Sosyal Medya', None),
    ('Terms of service', 'Kullanım Şartları', None),
    ('Privacy policy', 'Gizlilik Politikası', None),
    ('Cookie Policy', 'Çerez Politikası', None),
]

# Elementor'un menu JS'i calismasa bile acilir menuyu calistiran saf CSS yedegi.
# JS calisirsa paneli DOM'da tasidigi icin bu kurallar devreye girmez, cakismaz.
MENU_YEDEK_CSS = '''<style id="hepon-menu-yedek">
/* DIKKAT: .e-n-menu-item'a position:relative VERME - Elementor JS'inin panel
   konumlandirmasini bozuyor (paneli li'ye gore hesaplatir, ekran disina tasar). */
.e-n-menu-item:hover > .e-con,
.e-n-menu-item:focus-within > .e-con{
  display:flex !important;
  position:absolute; top:100%; left:0; right:0;
  z-index:99999; background:#fff;
  box-shadow:0 30px 70px rgba(11,18,32,.22);
  border-radius:0 0 18px 18px; overflow:hidden;
}
@media (max-width:1024px){
  .e-n-menu-item:hover > .e-con,
  .e-n-menu-item:focus-within > .e-con{position:static;box-shadow:none}
}
</style>
<script id="hepon-menu-yedek-devir">
/* Elementor JS'i basariyla baslarsa CSS yedegini kaldir: menuyu tek sahip yonetsin. */
(function () {
  var deneme = 0;
  var sayac = setInterval(function () {
    deneme += 1;
    var hazir = window.elementorFrontend && window.elementorFrontend.elementsHandler;
    if (hazir) {
      var stil = document.getElementById("hepon-menu-yedek");
      if (stil) stil.remove();
      clearInterval(sayac);
    } else if (deneme > 40) {
      clearInterval(sayac); /* 10 sn icinde baslamadi: yedek devrede kalir */
    }
  }, 250);
})();
</script>'''

def etiketle_degistir(blok, tablo):
    for eski, yeni, href in tablo:
        yer = 0
        while True:
            m = re.search(r'(>\s*)' + re.escape(eski) + r'(\s*<)', blok[yer:])
            if not m:
                break
            bas = yer + m.start()
            if href:
                a = blok.rfind('<a', max(0, bas - 400), bas)
                if a >= 0:
                    hm = re.search(r'href="[^"]*"', blok[a:bas])
                    if hm:
                        blok = blok[:a + hm.start()] + f'href="{href}"' + blok[a + hm.end():]
                        bas += len(f'href="{href}"') - (hm.end() - hm.start())
            m2 = re.search(r'(>\s*)' + re.escape(eski) + r'(\s*<)', blok[bas - 2:])
            if m2:
                s = bas - 2 + m2.start(1) + len(m2.group(1))
                blok = blok[:s] + yeni + blok[s + len(eski):]
                yer = s + len(yeni)
            else:
                yer = bas + 1
    return blok

def indir(url, hedef):
    os.makedirs(os.path.dirname(hedef), exist_ok=True)
    r = subprocess.run(['curl', '-s', '-f', '-L', '--max-time', '30', url, '-o', hedef])
    return r.returncode == 0

def asset_indir(html_listesi):
    urls = set()
    for src in html_listesi:
        for m in re.finditer(re.escape(BASE) + r'(/wp-(?:content|includes)/[^"\'\s\)\\,]+)', src):
            u = m.group(1).split('?')[0]
            if not u.endswith('/'):
                urls.add(u)
    yeni = 0
    for u in sorted(urls):
        hedef = PUB + '/wp' + u
        if not os.path.exists(hedef):
            if indir(BASE + u, hedef):
                yeni += 1
            else:
                print('  ASSET HATA:', u)
    # CSS ikinci gecis: mutlak referanslar
    import glob
    css_js = glob.glob(PUB + '/wp/**/*.css', recursive=True) + glob.glob(PUB + '/wp/**/*.js', recursive=True)
    for f in css_js:
        icerik = open(f, encoding='utf-8', errors='ignore').read()
        for m in re.finditer(re.escape(BASE) + r'(/wp-(?:content|includes)/[^"\'\s\)\\,]+)', icerik):
            u = m.group(1).split('?')[0]
            hedef = PUB + '/wp' + u
            if not os.path.exists(hedef):
                indir(BASE + u, hedef)
        yeni_icerik = icerik.replace(BASE + '/wp-content', '/wp/wp-content').replace(BASE + '/wp-includes', '/wp/wp-includes')
        yeni_icerik = yeni_icerik.replace('https:\\/\\/1217253.eu14.myftpupload.com\\/wp-content', '\\/wp\\/wp-content')
        yeni_icerik = yeni_icerik.replace('https:\\/\\/1217253.eu14.myftpupload.com\\/wp-includes', '\\/wp\\/wp-includes')
        if yeni_icerik != icerik:
            open(f, 'w', encoding='utf-8').write(yeni_icerik)
    # Elementor webpack runtime'larindaki tembel JS parcalari (mega menu vb.)
    parca_sayisi = 0
    for eklenti in ['elementor', 'elementor-pro']:
        dizin = f'{PUB}/wp/wp-content/plugins/{eklenti}/assets/js'
        if not os.path.isdir(dizin):
            continue
        for runtime in os.listdir(dizin):
            if 'runtime' not in runtime:
                continue
            icerik = open(os.path.join(dizin, runtime), encoding='utf-8', errors='ignore').read()
            for p in set(re.findall(r'"([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-f0-9]{16,}\.bundle\.min\.js)"', icerik)):
                hedef = os.path.join(dizin, p)
                if not os.path.exists(hedef):
                    if indir(f'{BASE}/wp-content/plugins/{eklenti}/assets/js/{p}', hedef):
                        parca_sayisi += 1
    print(f'  yeni indirilen asset: {yeni} + {parca_sayisi} JS parcasi (toplam referans: {len(urls)})')

def bos_butonlari_bagla(src, cta):
    """'#' hedefli elementor butonlarini sayfa turune gore baglar."""
    parcalar, son = [], 0
    import html as H
    for m in re.finditer(r'<a class="elementor-button[^"]*"[^>]*href="#?"[^>]*>.*?</a>', src, flags=re.S):
        blok = m.group(0)
        metin = re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', blok))).strip()
        yeni_blok = None
        def hedefle(hedef):
            return re.sub(r'href="#?"', f'href="{hedef}"', blok, count=1)
        if 'Teklif' in metin and cta and cta[0] in ('modal', 'akis', 'link'):
            if cta[0] == 'modal':
                yeni_blok = blok.replace('class="elementor-button', 'class="hepon-teklif-trigger elementor-button', 1)
                yeni_blok = re.sub(r'href="#?"', f'href="#" data-product="{cta[1]}"', yeni_blok, count=1)
            elif cta[0] == 'akis':
                yeni_blok = blok.replace('class="elementor-button', 'class="hepon-akis-ac elementor-button', 1)
                yeni_blok = re.sub(r'href="#?"', f'href="{cta[2]}"', yeni_blok, count=1)
            else:
                yeni_blok = hedefle(cta[1])
        elif 'İletişim' in metin or 'Iletisim' in metin:
            yeni_blok = hedefle('/iletisim/')
        elif 'Sigorta Türleri' in metin or 'Ürünleri İncele' in metin or 'Sigorta Ürünleri' in metin:
            yeni_blok = hedefle('/#urunler')
        elif 'Teklif Sürecini' in metin:
            yeni_blok = hedefle('/#urunler')
        elif 'Teklif' in metin:  # cta'siz sayfalarda (orn. hakkimizda hero) urunlere goturur
            yeni_blok = hedefle('/#urunler')
        if yeni_blok:
            parcalar.append(src[son:m.start()])
            parcalar.append(yeni_blok)
            son = m.end()
    parcalar.append(src[son:])
    return ''.join(parcalar)

def anasayfa_kartlari(src):
    """Kart tetikleyicilerini kaldirip butonlari urun sayfalarina baglar."""
    for kod, hedef in KART_HEDEF.items():
        m = re.search(r'data-product="%s"' % kod, src)
        if not m:
            continue
        tag_bas = src.rfind('<div', 0, m.start())
        tag_son = src.find('>', m.end())
        tag = src[tag_bas:tag_son].replace('hepon-teklif-trigger ', '').replace(' hepon-teklif-trigger', '')
        j = src.find('href="#"', tag_son)
        if 0 < j - tag_son < 4000:
            src = src[:tag_bas] + tag + src[tag_son:j] + f'href="{hedef}"' + src[j + 8:]
        else:
            src = src[:tag_bas] + tag + src[tag_son:]
    # kalan data-product'siz yetim tetikleyiciler
    def yetim_temizle(m):
        tag = m.group(0)
        if 'data-product' not in tag:
            return tag.replace('hepon-teklif-trigger ', '').replace(' hepon-teklif-trigger', '')
        return tag
    src = re.sub(r'<[^>]*hepon-teklif-trigger[^>]*>', yetim_temizle, src)
    # urunler bolumu capasi
    if 'id="urunler"' not in src:
        m = re.search(r'data-product="', src) or re.search(r'Sigorta Ürünler', src)
        if m:
            j = src.rfind('e-parent', 0, m.start())
            k = src.rfind('<div', 0, j)
            if k > 0:
                src = src[:k + 4] + ' id="urunler"' + src[k + 4:]
    return src

def calistir(indirme=True):
    os.makedirs(KAYNAK_DIZIN, exist_ok=True)
    kaynaklar = {}
    for slug in SAYFALAR:
        ad = slug or 'anasayfa'
        yol = os.path.join(KAYNAK_DIZIN, ad + '.html')
        if indirme:
            if not indir(f'{BASE}/{slug}/' if slug else BASE + '/', yol):
                print('SAYFA INDIRILEMEDI:', ad)
                continue
        if not os.path.exists(yol):
            print('KAYNAK YOK:', yol)
            continue
        kaynaklar[slug] = open(yol, encoding='utf-8').read()

    print('asset taramasi...')
    asset_indir(list(kaynaklar.values()))

    modal_html = open(PUB + '/modal/modal.html', encoding='utf-8').read()

    for slug, src in kaynaklar.items():
        yerel, baslik, cta = SAYFALAR[slug]

        # head temizligi
        src = src.replace('<html lang="en-US"', '<html lang="tr"')
        src = re.sub(r'<title>.*?</title>', f'<title>{baslik}</title>', src, count=1)
        src = re.sub(r'<meta name=.robots.[^>]*>\n?', '', src)
        src = re.sub(r'<link rel="(alternate|canonical|shortlink|EditURI)"[^>]*>\n?', '', src)
        src = re.sub(r'<script type="speculationrules">.*?</script>', '', src, flags=re.S)

        # asset ve sayfa linkleri
        src = src.replace(BASE + '/wp-content', '/wp/wp-content')
        src = src.replace(BASE + '/wp-includes', '/wp/wp-includes')
        src = re.sub(re.escape(BASE) + r'(/[^"\'\\ ]*)?', lambda m: sayfa_linki(m.group(1)), src)
        # JSON config icindeki kacisli asset yollari (Elementor webpack publicPath buradan okur)
        src = src.replace('https:\\/\\/1217253.eu14.myftpupload.com\\/wp-content', '\\/wp\\/wp-content')
        src = src.replace('https:\\/\\/1217253.eu14.myftpupload.com\\/wp-includes', '\\/wp\\/wp-includes')
        src = src.replace('https:\\/\\/1217253.eu14.myftpupload.com', '')
        src = src.replace('1217253.eu14.myftpupload.com%20Managed%20WordPress%20Site', 'Hepon%20Sigorta')
        src = src.replace('1217253.eu14.myftpupload.com Managed WordPress Site', 'Hepon Sigorta')
        src = src.replace('href="index.html"', 'href="/"')

        # logo sadelestirme
        src = src.replace('src="/wp/wp-content/uploads/2025/12/heponla-logo.png"', 'src="/logo-heponla.png"')
        src = src.replace('src="/wp/wp-content/uploads/2026/02/Logo_white.svg"', 'src="/logo-hepon-beyaz.svg"')
        src = src.replace('src="/wp/wp-content/uploads/2026/02/Logo.svg"', 'src="/logo-hepon.svg"')

        # VamTam telif (duz ve entity halleri)
        src = src.replace('>2026 &copy; VamTam. All rights reserved<', '>© 2026 Hepon Sigorta Acenteliği<')
        src = src.replace('>2026 © VamTam. All rights reserved<', '>© 2026 Hepon Sigorta Acenteliği<')
        src = src.replace('href="https://vamtam.com/"', 'href="/"')

        # footer/genel Turkcelestirme
        src = etiketle_degistir(src, FOOTER_TABLO)

        # sayfa turune ozel baglama
        # urun kartlari iceren sayfalar (ana sayfa, hakkimizda vb.)
        if 'data-product="' in src and (not cta or cta[0] != 'modal'):
            src = anasayfa_kartlari(src)
        src = bos_butonlari_bagla(src, cta if slug != '' else None)
        if cta:
            if cta[0] == 'modal':
                ek = ('<link rel="stylesheet" href="/modal/modal.css">\n' + modal_html +
                      '\n<script src="/modal/modal.js"></script>\n')
                src = src.replace('</body>', ek + '</body>', 1)
            elif cta[0] == 'akis':
                ek = ('<link rel="stylesheet" href="/akis/akis.css">\n'
                      f'<script src="/akis/{cta[1]}.js"></script>\n')
                src = src.replace('</body>', ek + '</body>', 1)
            elif cta[0] == 'js':
                src = src.replace('</body>', f'<script src="/akis/{cta[1]}.js"></script>\n</body>', 1)

        # yonetim paneli arama motorlarina kapali kalsin
        if slug == 'yonetim':
            src = src.replace('</title>', '</title>\n<meta name="robots" content="noindex, nofollow">', 1)

        # menu yedek CSS'i her sayfada
        if '</head>' in src:
            src = src.replace('</head>', MENU_YEDEK_CSS + '\n</head>', 1)

        hedef = os.path.join(PUB, yerel, 'index.html') if yerel else os.path.join(PUB, 'index.html')
        os.makedirs(os.path.dirname(hedef), exist_ok=True)
        open(hedef, 'w', encoding='utf-8').write(src)
        print(f'  {yerel or "ana sayfa":32} yazildi (staging ref: {src.count("myftpupload")})')

    # logolar
    for kaynak, hedef in [('/wp/wp-content/uploads/2025/12/heponla-logo.png', '/logo-heponla.png'),
                          ('/wp/wp-content/uploads/2026/02/Logo_white.svg', '/logo-hepon-beyaz.svg'),
                          ('/wp/wp-content/uploads/2026/02/Logo.svg', '/logo-hepon.svg')]:
        if os.path.exists(PUB + kaynak):
            subprocess.run(['cp', PUB + kaynak, PUB + hedef])
    print('bitti. Simdi: npm run build && sudo cp -r out/* /var/www/hepon/')

if __name__ == '__main__':
    calistir(indirme='--indirme' not in sys.argv)
