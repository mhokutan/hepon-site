/* Heponla Canli Site Editoru - backend baglantisi (tasarimcinin kontratina gore
   yazilimci tarafindan dolduruldu). Kimlik: /yonetim/ ile ayni admin oturumu
   (sessionStorage hepon_admin, x-admin basligi). */
window.HEPONLA_CMS_CONFIG = {
  demoMode: false,
  saveDraftEndpoint: "/api/cms/drafts",
  publishEndpoint: "/api/cms/publish",
  mediaUploadEndpoint: "/api/cms/media",
  currentUserEndpoint: "/api/auth/session"
};

window.addEventListener("DOMContentLoaded", () => {
  const config = window.HEPONLA_CMS_CONFIG;
  const token = sessionStorage.getItem("hepon_admin") || "";

  // oturum kontrolu: gecersizse icerik paneline (giris oradan) gonder
  fetch(config.currentUserEndpoint, { headers: { "x-admin": token } })
    .then((r) => r.json())
    .then((o) => {
      if (!o || o.error) {
        alert("Önce İçerik Yönetimi panelinden giriş yapın; editör oradan açılır.");
        window.location.href = "/icerik/";
      }
    })
    .catch(() => undefined);

  const saveButton = document.querySelector("#leSaveAll");
  if (!saveButton) return;

  const durum = (mesaj) => {
    saveButton.textContent = mesaj;
    setTimeout(() => { saveButton.textContent = "Taslak kaydet"; }, 2500);
  };

  // Yayinla dugmesi (tasarim taslak kaydetle bitiyor; yayin adimini biz ekledik)
  const yayinBtn = document.createElement("button");
  yayinBtn.className = "le-action primary";
  yayinBtn.id = "leYayinla";
  yayinBtn.textContent = "Yayınla";
  yayinBtn.style.background = "#1DB586";
  saveButton.after(yayinBtn);
  yayinBtn.onclick = async () => {
    const cevap = await fetch(config.publishEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin": token },
      body: JSON.stringify({ page: document.querySelector("#lePage")?.value || "/" }),
    }).then((r) => r.json()).catch(() => null);
    yayinBtn.textContent = (cevap && cevap.ok) ? `✓ ${cevap.yayinlanan} değişiklik yayında` : "Yayınlanamadı";
    setTimeout(() => { yayinBtn.textContent = "Yayınla"; }, 2500);
  };

  saveButton.onclick = async () => {
    const degisiklikler = window.heponlaLiveEditorChanges || [];
    if (!degisiklikler.length) { durum("Değişiklik yok"); return; }
    const cevap = await fetch(config.saveDraftEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin": token },
      body: JSON.stringify({
        page: document.querySelector("#lePage")?.value || "/",
        changes: degisiklikler,
        status: "draft",
      }),
    }).then((r) => r.json()).catch(() => null);
    if (cevap && cevap.ok) {
      degisiklikler.length = 0;
      durum(`✓ ${cevap.kaydedilen} taslak kaydedildi`);
    } else {
      durum((cevap && cevap.error) || "Kaydedilemedi");
    }
  };

  // Gorsel dosyasi secilince gercek yukleme yap (blob URL kalici degildir)
  const imageFile = document.querySelector("#leImageFile");
  const imageUrl = document.querySelector("#leImage");
  if (imageFile && imageUrl) {
    imageFile.addEventListener("change", async () => {
      const dosya = imageFile.files[0];
      if (!dosya) return;
      const f = new FormData();
      f.append("dosya", dosya);
      const cevap = await fetch(config.mediaUploadEndpoint, {
        method: "POST", headers: { "x-admin": token }, body: f,
      }).then((r) => r.json()).catch(() => null);
      if (cevap && cevap.ok) {
        imageUrl.value = cevap.url;
        const secili = document.querySelector("#leFrame")?.contentDocument
          ?.querySelector('[data-hepon-live-selected]');
        if (secili && secili.tagName === "IMG") secili.src = cevap.url;
      } else {
        alert((cevap && cevap.error) || "Görsel yüklenemedi (10 MB, jpg/png/webp/gif/svg)");
      }
    });
  }
});
