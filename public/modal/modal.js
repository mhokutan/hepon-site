  (() => {
    "use strict";

    const modal = document.getElementById("heponQuoteModal");
    const form = document.getElementById("heponQuoteForm");
    const productName = document.getElementById("heponSelectedProduct");
    const productInput = document.getElementById("heponProductInput");
    const dynamicFields = document.getElementById("heponDynamicFields");
    const searchButton = document.getElementById("heponSearchQuotes");
    const offerList = document.getElementById("heponOfferList");
    const offerCount = document.getElementById("heponOfferCount");
    const restartButton = document.getElementById("heponRestart");

    const selectedOfferCompany = document.getElementById("heponSelectedOfferCompany");
    const selectedOfferProduct = document.getElementById("heponSelectedOfferProduct");
    const selectedOfferPrice = document.getElementById("heponSelectedOfferPrice");
    const selectedOfferInstallment = document.getElementById("heponSelectedOfferInstallment");
    const summaryName = document.getElementById("heponSummaryName");
    const summaryPhone = document.getElementById("heponSummaryPhone");
    const summaryEmail = document.getElementById("heponSummaryEmail");
    const summaryQuoteId = document.getElementById("heponSummaryQuoteId");
    const coverageList = document.getElementById("heponCoverageList");
    const finalApproval = document.getElementById("heponFinalApproval");
    const finalStatus = document.getElementById("heponFinalStatus");
    const backToOffersButton = document.getElementById("heponBackToOffers");
    const goToCompanyPaymentButton = document.getElementById("heponGoToCompanyPayment");

    const otpPhone = document.getElementById("heponOtpPhone");
    const otpCode = document.getElementById("heponOtpCode");
    const otpTimer = document.getElementById("heponOtpTimer");
    const otpResend = document.getElementById("heponOtpResend");
    const otpMessage = document.getElementById("heponOtpMessage");
    const otpBack = document.getElementById("heponOtpBack");
    const verifyOtpButton = document.getElementById("heponVerifyOtp");



    let currentStep = 1;
    let selectedProduct = "trafik";
    let selectedOffer = null;
    let otpRequestId = "";
    let otpCountdown = 0;
    let otpInterval = null;

    const products = {
      trafik: {
        name: "Trafik Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik / Vergi No",
            type: "text",
            placeholder: "Kimlik veya vergi numarası",
            required: true
          },
          {
            name: "plate",
            label: "Plaka",
            type: "text",
            placeholder: "Örn. 42 ABC 123",
            required: true
          },
          {
            name: "document_serial",
            label: "Ruhsat Belge Seri No",
            type: "document_serial",
            required: true,
            full: true
          },
          {
            name: "renewal_date",
            label: "Poliçe Yenileme Tarihi",
            type: "date",
            required: false
          }
        ]
      },

      kasko: {
        name: "Kasko Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik / Vergi No",
            type: "text",
            placeholder: "Kimlik veya vergi numarası",
            required: true
          },
          {
            name: "plate",
            label: "Plaka",
            type: "text",
            placeholder: "Örn. 42 ABC 123",
            required: true
          },
          {
            name: "document_serial",
            label: "Ruhsat Belge Seri No",
            type: "document_serial",
            required: true,
            full: true
          },
          {
            name: "vehicle_use",
            label: "Araç Kullanım Şekli",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["private", "Hususi"],
              ["commercial", "Ticari"],
              ["taxi", "Taksi"],
              ["other", "Diğer"]
            ]
          },
          {
            name: "existing_policy",
            label: "Mevcut Kasko Poliçesi",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["yes", "Var"],
              ["no", "Yok"]
            ]
          },
          {
            name: "coverage_preference",
            label: "Teminat Tercihi",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["standard", "Standart"],
              ["extended", "Genişletilmiş"],
              ["premium", "Premium"]
            ]
          }
        ]
      },

      imm: {
        name: "İMM Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik / Vergi No",
            type: "text",
            placeholder: "Kimlik veya vergi numarası",
            required: true
          },
          {
            name: "plate",
            label: "Plaka",
            type: "text",
            placeholder: "Araç plakası",
            required: true
          },
          {
            name: "document_serial",
            label: "Ruhsat Belge Seri No",
            type: "document_serial",
            required: true,
            full: true
          },
          {
            name: "coverage_limit",
            label: "Teminat Limiti",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["1000000", "1.000.000 TL"],
              ["2500000", "2.500.000 TL"],
              ["5000000", "5.000.000 TL"],
              ["10000000", "10.000.000 TL"]
            ]
          }
        ]
      },

      "seyahat-saglik": {
        name: "Seyahat Sağlık Sigortası",
        fields: [
          {
            name: "birth_date",
            label: "Doğum Tarihi",
            type: "date",
            required: true
          },
          {
            name: "destination",
            label: "Gidilecek Ülke / Bölge",
            type: "text",
            placeholder: "Örn. Almanya",
            required: true
          },
          {
            name: "travel_start",
            label: "Seyahat Başlangıç Tarihi",
            type: "date",
            required: true
          },
          {
            name: "travel_end",
            label: "Seyahat Bitiş Tarihi",
            type: "date",
            required: true
          },
          {
            name: "traveller_count",
            label: "Sigortalanacak Kişi Sayısı",
            type: "number",
            placeholder: "1",
            required: true
          },
          {
            name: "passport_number",
            label: "Pasaport Numarası",
            type: "text",
            placeholder: "Pasaport numarası",
            required: false
          }
        ]
      },

      dask: {
        name: "DASK Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik / Vergi No",
            type: "text",
            placeholder: "Kimlik veya vergi numarası",
            required: true
          },
          {
            name: "address_code",
            label: "UAVT Adres Kodu",
            type: "text",
            placeholder: "10 haneli adres kodu",
            required: true
          },
          {
            name: "city",
            label: "İl",
            type: "text",
            placeholder: "İl",
            required: true
          },
          {
            name: "district",
            label: "İlçe",
            type: "text",
            placeholder: "İlçe",
            required: true
          },
          {
            name: "building_year",
            label: "Bina İnşa Yılı",
            type: "number",
            placeholder: "Örn. 2015",
            required: true
          },
          {
            name: "gross_area",
            label: "Brüt Metrekare",
            type: "number",
            placeholder: "Örn. 130",
            required: true
          },
          {
            name: "floor_count",
            label: "Toplam Kat Sayısı",
            type: "number",
            placeholder: "Örn. 8",
            required: true
          },
          {
            name: "construction_type",
            label: "Yapı Tarzı",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["steel_concrete", "Çelik / Betonarme"],
              ["masonry", "Yığma Kâgir"],
              ["other", "Diğer"]
            ]
          }
        ]
      },

      "yabanci-saglik": {
        name: "Yabancı Sağlık Sigortası",
        fields: [
          {
            name: "passport_number",
            label: "Pasaport Numarası",
            type: "text",
            placeholder: "Pasaport numarası",
            required: true
          },
          {
            name: "nationality",
            label: "Uyruk",
            type: "text",
            placeholder: "Uyruğunuz",
            required: true
          },
          {
            name: "birth_date",
            label: "Doğum Tarihi",
            type: "date",
            required: true
          },
          {
            name: "gender",
            label: "Cinsiyet",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["female", "Kadın"],
              ["male", "Erkek"]
            ]
          },
          {
            name: "residence_city",
            label: "İkamet Edilen İl",
            type: "text",
            placeholder: "İl",
            required: true
          },
          {
            name: "policy_duration",
            label: "Poliçe Süresi",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["1_year", "1 Yıl"],
              ["2_years", "2 Yıl"]
            ]
          }
        ]
      },

      tss: {
        name: "Tamamlayıcı Sağlık Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik No",
            type: "text",
            placeholder: "T.C. kimlik numarası",
            required: true
          },
          {
            name: "birth_date",
            label: "Doğum Tarihi",
            type: "date",
            required: true
          },
          {
            name: "gender",
            label: "Cinsiyet",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["female", "Kadın"],
              ["male", "Erkek"]
            ]
          },
          {
            name: "city",
            label: "İkamet Edilen İl",
            type: "text",
            placeholder: "İl",
            required: true
          },
          {
            name: "insured_count",
            label: "Sigortalanacak Kişi Sayısı",
            type: "number",
            placeholder: "1",
            required: true
          },
          {
            name: "treatment_type",
            label: "Tedavi Paketi",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["inpatient", "Yatarak Tedavi"],
              ["inpatient_outpatient", "Yatarak + Ayakta Tedavi"]
            ]
          }
        ]
      },

      "ferdi-kaza": {
        name: "Ferdi Kaza Sigortası",
        fields: [
          {
            name: "identity_number",
            label: "T.C. Kimlik No",
            type: "text",
            placeholder: "T.C. kimlik numarası",
            required: true
          },
          {
            name: "birth_date",
            label: "Doğum Tarihi",
            type: "date",
            required: true
          },
          {
            name: "occupation",
            label: "Meslek",
            type: "text",
            placeholder: "Mesleğiniz",
            required: true
          },
          {
            name: "coverage_amount",
            label: "Teminat Tutarı",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["250000", "250.000 TL"],
              ["500000", "500.000 TL"],
              ["1000000", "1.000.000 TL"]
            ]
          },
          {
            name: "risky_activity",
            label: "Riskli Spor / Faaliyet",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["no", "Yok"],
              ["yes", "Var"]
            ]
          }
        ]
      },

      "mesleki-sorumluluk": {
        name: "Mesleki Sorumluluk Sigortası",
        fields: [
          {
            name: "profession_group",
            label: "Meslek Grubu",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["doctor", "Doktor"],
              ["lawyer", "Avukat"],
              ["architect", "Mimar"],
              ["engineer", "Mühendis"],
              ["accountant", "Mali Müşavir"],
              ["consultant", "Danışman"],
              ["other", "Diğer"]
            ]
          },
          {
            name: "identity_or_tax",
            label: "T.C. Kimlik / Vergi No",
            type: "text",
            placeholder: "Kimlik veya vergi numarası",
            required: true
          },
          {
            name: "experience_years",
            label: "Faaliyet Süresi",
            type: "number",
            placeholder: "Yıl",
            required: true
          },
          {
            name: "annual_turnover",
            label: "Yıllık Ciro",
            type: "number",
            placeholder: "TL",
            required: true
          },
          {
            name: "employee_count",
            label: "Çalışan Sayısı",
            type: "number",
            placeholder: "Kişi",
            required: true
          },
          {
            name: "coverage_limit",
            label: "Teminat Limiti",
            type: "select",
            required: true,
            options: [
              ["", "Seçiniz"],
              ["500000", "500.000 TL"],
              ["1000000", "1.000.000 TL"],
              ["2500000", "2.500.000 TL"],
              ["5000000", "5.000.000 TL"]
            ]
          }
        ]
      }
    };

    const demoOffers = [
      {
        quote_id: "HPN-DEMO-1001",
        company: "Sigorta Şirketi A",
        price: 8450,
        installments: "3 taksit seçeneği",
        detail: "Standart teminatlar ve danışman desteği",
        coverages: [
          "Ürüne ait zorunlu ana teminatlar",
          "Sigorta şirketi asistans hizmetleri",
          "Poliçe ve hasar destek hizmeti"
        ],
        payment_url: ""
      },
      {
        quote_id: "HPN-DEMO-1002",
        company: "Sigorta Şirketi B",
        price: 9120,
        installments: "6 taksit seçeneği",
        detail: "Genişletilmiş asistans hizmetleri",
        coverages: [
          "Ürüne ait zorunlu ana teminatlar",
          "Genişletilmiş asistans hizmetleri",
          "Sigorta şirketi çağrı merkezi desteği"
        ],
        payment_url: ""
      },
      {
        quote_id: "HPN-DEMO-1003",
        company: "Sigorta Şirketi C",
        price: 9785,
        installments: "Peşin veya 4 taksit",
        detail: "Ek hizmet seçenekleriyle birlikte",
        coverages: [
          "Ürüne ait zorunlu ana teminatlar",
          "Ek hizmet seçenekleri",
          "Dijital poliçe teslimi"
        ],
        payment_url: ""
      }
    ];

    function escapeHTML(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function createField(field) {
      const wrapper = document.createElement("div");
      wrapper.className = "hepon-field" + (field.full ? " is-full" : "");

      const id = "hepon_" + field.name;
      const required = field.required ? "required" : "";

      let control = "";

      if (field.type === "document_serial") {
        wrapper.classList.add("is-full");
        wrapper.innerHTML = `
          <label>RUHSAT BELGE SERİ NO</label>

          <div class="hepon-document-serial">
            <input
              id="hepon_document_series"
              name="document_series"
              type="text"
              inputmode="text"
              autocomplete="off"
              maxlength="2"
              pattern="[A-Za-zÇĞİÖŞÜçğıöşü]{2}"
              placeholder="AB"
              aria-label="Ruhsat belge seri: 2 harf"
              required
            >

            <input
              id="hepon_document_number"
              name="document_number"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              maxlength="6"
              pattern="[0-9]{6}"
              placeholder="123456"
              aria-label="Ruhsat belge numarası: 6 rakam"
              required
            >
          </div>

          <div class="hepon-document-helper">
            Ruhsatta “Belge Seri No” alanında bulunan 2 harf ve 6 rakamı girin. Örnek: AB 123456.
          </div>

          <span class="hepon-field-error">
            Ruhsat belge seri no 2 harf ve 6 rakamdan oluşmalıdır.
          </span>
        `;

        return wrapper;
      }

      if (field.type === "select") {
        const options = field.options
          .map(
            ([value, label]) =>
              `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`
          )
          .join("");

        control = `
          <select
            id="${id}"
            name="${escapeHTML(field.name)}"
            ${required}
          >
            ${options}
          </select>
        `;
      } else if (field.type === "textarea") {
        control = `
          <textarea
            id="${id}"
            name="${escapeHTML(field.name)}"
            placeholder="${escapeHTML(field.placeholder || "")}"
            ${required}
          ></textarea>
        `;
      } else {
        control = `
          <input
            id="${id}"
            name="${escapeHTML(field.name)}"
            type="${escapeHTML(field.type || "text")}"
            placeholder="${escapeHTML(field.placeholder || "")}"
            ${required}
          >
        `;
      }

      wrapper.innerHTML = `
        <label for="${id}">${escapeHTML(String(field.label).toLocaleUpperCase('tr-TR'))}</label>
        ${control}
        <span class="hepon-field-error">Bu alan zorunludur.</span>
      `;

      return wrapper;
    }

    function renderProductFields(productCode) {
      const product = products[productCode] || products.trafik;

      dynamicFields.innerHTML = "";

      product.fields.forEach((field) => {
        dynamicFields.appendChild(createField(field));
      });

      productName.textContent = product.name;
      productInput.value = productCode;
    }

    function updateProgress() {
      const bars = modal.querySelectorAll(".hepon-progress-item");

      bars.forEach((bar, index) => {
        bar.classList.toggle("is-active", index < currentStep);
      });
    }

    function showStep(stepNumber) {
      currentStep = stepNumber;

      modal.querySelectorAll(".hepon-step").forEach((step) => {
        step.classList.toggle(
          "is-active",
          Number(step.dataset.step) === stepNumber
        );
      });

      updateProgress();

      const dialog = modal.querySelector(".hepon-quote-dialog");

      if (dialog) {
        dialog.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }

    function clearErrors(container) {
      container
        .querySelectorAll(".is-error")
        .forEach((field) => field.classList.remove("is-error"));

      container
        .querySelectorAll(".hepon-field-error")
        .forEach((error) => error.classList.remove("is-visible"));
    }

    function validateContainer(container) {
      clearErrors(container);

      const requiredFields = container.querySelectorAll("[required]");
      let valid = true;

      requiredFields.forEach((field) => {
        let fieldValid = field.checkValidity();

        if (field.type === "checkbox") {
          fieldValid = field.checked;
        }

        if (!fieldValid) {
          valid = false;
          field.classList.add("is-error");

          const parent = field.closest(".hepon-field");

          if (parent) {
            const message = parent.querySelector(".hepon-field-error");

            if (message) {
              message.classList.add("is-visible");
            }
          }
        }
      });

      return valid;
    }

    function collectFormData() {
      const data = Object.fromEntries(new FormData(form).entries());

      if (data.document_series && data.document_number) {
        data.document_serial =
          String(data.document_series).toLocaleUpperCase("tr-TR") +
          String(data.document_number);
      }

      return data;
    }

    function formatPrice(price) {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0
      }).format(price);
    }

    function renderOffers(offers) {
      offerCount.textContent = `${offers.length} teklif bulundu`;

      offerList.innerHTML = offers
        .map(
          (offer, index) => `
            <article class="hepon-offer-card">
              <div>
                <div class="hepon-offer-company">
                  ${escapeHTML(offer.company)}
                </div>

                <div class="hepon-offer-detail">
                  ${escapeHTML(offer.detail)}
                </div>
              </div>

              <div class="hepon-offer-price">
                <div class="hepon-offer-price-value">
                  ${formatPrice(offer.price)}
                </div>

                <div class="hepon-offer-installment">
                  ${escapeHTML(offer.installments)}
                </div>

                <button
                  type="button"
                  class="hepon-offer-select"
                  data-offer-index="${index}"
                >
                  Teklifi Seç
                </button>
              </div>
            </article>
          `
        )
        .join("");
    }


    function setFinalStatus(message, type = "info") {
      finalStatus.textContent = message;
      finalStatus.className = `hepon-step-status is-visible is-${type}`;
    }

    function clearFinalStatus() {
      finalStatus.textContent = "";
      finalStatus.className = "hepon-step-status";
    }

    function renderSelectedOffer(offer) {
      const data = collectFormData();
      const product = products[selectedProduct] || products.trafik;

      selectedOfferCompany.textContent = offer.company || "Sigorta Şirketi";
      selectedOfferProduct.textContent = product.name;
      selectedOfferPrice.textContent = formatPrice(Number(offer.price || 0));
      selectedOfferInstallment.textContent = offer.installments || "Taksit bilgisi";
      summaryName.textContent = data.full_name || "—";
      summaryPhone.textContent = data.phone || "—";
      summaryEmail.textContent = data.email || "—";
      summaryQuoteId.textContent = offer.quote_id || "Teklif oluşturulduğunda gelecektir";

      const coverages = Array.isArray(offer.coverages) && offer.coverages.length
        ? offer.coverages
        : ["Teminat bilgileri sigorta şirketinden alınacaktır."];

      coverageList.innerHTML = coverages
        .map((item) => `<li>${escapeHTML(item)}</li>`)
        .join("");

      finalApproval.checked = false;
      clearFinalStatus();
    }

    async function redirectToCompanyPayment() {
      if (!selectedOffer) {
        setFinalStatus("Lütfen önce bir teklif seçin.", "error");
        return;
      }

      if (!finalApproval.checked) {
        setFinalStatus(
          "Devam etmek için teklif bilgilerini kontrol ettiğinizi onaylayın.",
          "error"
        );
        return;
      }

      goToCompanyPaymentButton.disabled = true;
      goToCompanyPaymentButton.textContent = "Yönlendirme hazırlanıyor…";
      setFinalStatus(
        "Sigorta şirketinin güvenli ödeme bağlantısı hazırlanıyor.",
        "info"
      );

      try {
        /*
         * GERÇEK POLİÇELEŞTİRME / ÖDEME YÖNLENDİRMESİ
         *
         * Tercih edilen güvenli yöntem:
         * 1. Frontend yalnızca quote_id gönderir.
         * 2. Heponla backend'i ilgili sigorta şirketine istek yapar.
         * 3. Backend kısa ömürlü payment_url / redirect_url döndürür.
         * 4. Kullanıcı o URL'ye yönlendirilir.
         *
         * Örnek:
         *
         * const response = await fetch("/api/insurance/checkout", {
         *   method: "POST",
         *   headers: { "Content-Type": "application/json" },
         *   body: JSON.stringify({
         *     quote_id: selectedOffer.quote_id,
         *     product: selectedProduct
         *   })
         * });
         *
         * if (!response.ok) {
         *   throw new Error("Ödeme bağlantısı oluşturulamadı.");
         * }
         *
         * const result = await response.json();
         * window.location.assign(result.redirect_url);
         */

        if (selectedOffer.payment_url) {
          window.location.assign(selectedOffer.payment_url);
          return;
        }

        window.setTimeout(() => {
          setFinalStatus(
            "Demo modundasınız. Gerçek entegrasyonda bu aşamada sigorta şirketinin güvenli ödeme sayfası açılacaktır.",
            "info"
          );
          goToCompanyPaymentButton.disabled = false;
          goToCompanyPaymentButton.innerHTML = `
            Sigorta Şirketinde Devam Et
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          `;
        }, 900);
      } catch (error) {
        console.error(error);
        setFinalStatus(
          "Yönlendirme bağlantısı hazırlanamadı. Lütfen tekrar deneyin.",
          "error"
        );
        goToCompanyPaymentButton.disabled = false;
        goToCompanyPaymentButton.innerHTML = `
          Sigorta Şirketinde Devam Et
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        `;
      }
    }


    function normalizePhone(phone) {
      let digits = String(phone || "").replace(/\D/g, "");

      if (digits.startsWith("90") && digits.length === 12) {
        digits = digits.slice(2);
      }

      if (digits.startsWith("5") && digits.length === 10) {
        digits = "0" + digits;
      }

      return digits;
    }

    function isValidTurkishMobile(phone) {
      return /^05\d{9}$/.test(normalizePhone(phone));
    }

    function maskPhone(phone) {
      const digits = normalizePhone(phone);

      if (digits.length !== 11) {
        return phone || "—";
      }

      return `${digits.slice(0, 4)} *** ** ${digits.slice(-2)}`;
    }

    function setOtpMessage(message, type = "info") {
      otpMessage.textContent = message;
      otpMessage.className = `hepon-otp-message is-visible is-${type}`;
    }

    function clearOtpMessage() {
      otpMessage.textContent = "";
      otpMessage.className = "hepon-otp-message";
    }

    function startOtpCountdown(seconds = 120) {
      window.clearInterval(otpInterval);
      otpCountdown = seconds;
      otpResend.disabled = true;

      const update = () => {
        if (otpCountdown <= 0) {
          window.clearInterval(otpInterval);
          otpTimer.textContent = "Kodun süresi doldu.";
          otpResend.disabled = false;
          return;
        }

        otpTimer.textContent = `Kodu ${otpCountdown} saniye içinde girin.`;
        otpCountdown -= 1;
      };

      update();
      otpInterval = window.setInterval(update, 1000);
    }

    async function sendOtp() {
      const phone = document.getElementById("heponPhone").value;

      if (!isValidTurkishMobile(phone)) {
        setOtpMessage(
          "SMS gönderebilmek için 05 ile başlayan geçerli bir cep telefonu numarası girin.",
          "error"
        );
        showStep(2);
        return false;
      }

      otpPhone.textContent = maskPhone(phone);
      otpCode.value = "";
      clearOtpMessage();
      showStep(3);

      /*
       * GERÇEK SMS GÖNDERİMİ
       *
       * SMS sağlayıcısının kullanıcı adı/şifresi frontend'e yazılmaz.
       * Frontend yalnızca Heponla backend'ine istek gönderir:
       *
       * const response = await fetch("/api/auth/send-otp", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json" },
       *   body: JSON.stringify({ phone: normalizePhone(phone) })
       * });
       *
       * if (!response.ok) throw new Error("Kod gönderilemedi.");
       * const result = await response.json();
       * otpRequestId = result.request_id;
       */

      otpRequestId = "DEMO-" + Date.now();
      startOtpCountdown(120);
      setOtpMessage(
        "Demo doğrulama kodu: 123456. Gerçek sistemde kod SMS sağlayıcısı üzerinden gönderilecektir.",
        "info"
      );
      return true;
    }

    async function verifyOtp() {
      const code = otpCode.value.replace(/\D/g, "");

      if (!/^\d{6}$/.test(code)) {
        setOtpMessage("Lütfen 6 haneli doğrulama kodunu girin.", "error");
        return;
      }

      verifyOtpButton.disabled = true;
      verifyOtpButton.textContent = "Doğrulanıyor…";

      try {
        /*
         * GERÇEK SMS DOĞRULAMA
         *
         * const response = await fetch("/api/auth/verify-otp", {
         *   method: "POST",
         *   headers: { "Content-Type": "application/json" },
         *   body: JSON.stringify({
         *     request_id: otpRequestId,
         *     code
         *   })
         * });
         *
         * if (!response.ok) throw new Error("Kod doğrulanamadı.");
         * const result = await response.json();
         * if (!result.verified) throw new Error("Kod geçersiz.");
         */

        if (otpRequestId.startsWith("DEMO-") && code !== "123456") {
          throw new Error("Demo kodu geçersiz.");
        }

        window.clearInterval(otpInterval);
        setOtpMessage("Telefon numaranız doğrulandı.", "info");

        window.setTimeout(() => {
          requestQuotes();
        }, 450);
      } catch (error) {
        console.error(error);
        setOtpMessage(
          "Doğrulama kodu hatalı veya süresi dolmuş. Lütfen tekrar deneyin.",
          "error"
        );
      } finally {
        verifyOtpButton.disabled = false;
        verifyOtpButton.textContent = "Kodu Doğrula";
      }
    }

    async function requestQuotes() {
      const formData = collectFormData();

      showStep(4);

      /*
       * GERÇEK API ENTEGRASYONU
       *
       * Yazılımcı aşağıdaki örnek yapıyı backend endpoint'iyle değiştirecek.
       *
       * Frontend doğrudan sigorta şirketlerinin API anahtarlarını kullanmamalıdır.
       *
       * const response = await fetch("/api/insurance/quotes", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json"
       *   },
       *   body: JSON.stringify(formData)
       * });
       *
       * if (!response.ok) {
       *   throw new Error("Teklifler alınamadı.");
       * }
       *
       * const result = await response.json();
       * renderOffers(result.quotes);
       * showStep(4);
       */

      console.log("Backend'e gönderilecek form verisi:", formData);

      window.setTimeout(() => {
        renderOffers(demoOffers);
        showStep(5);
      }, 2200);
    }

    function openModal(productCode) {
      selectedProduct = products[productCode] ? productCode : "trafik";
      selectedOffer = null;
      otpRequestId = "";
      window.clearInterval(otpInterval);

      form.reset();
      clearErrors(form);
      renderProductFields(selectedProduct);
      showStep(1);

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("hepon-modal-open");
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("hepon-modal-open");
    }

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".hepon-teklif-trigger");

      if (trigger) {
        event.preventDefault();
        openModal(trigger.getAttribute("data-product"));
        return;
      }

      if (event.target.closest("[data-hepon-close]")) {
        closeModal();
        return;
      }

      const nextButton = event.target.closest("[data-next-step]");

      if (nextButton) {
        const currentSection = modal.querySelector(
          `.hepon-step[data-step="${currentStep}"]`
        );

        if (validateContainer(currentSection)) {
          showStep(currentStep + 1);
        }

        return;
      }

      const previousButton = event.target.closest("[data-prev-step]");

      if (previousButton) {
        showStep(Math.max(1, currentStep - 1));
        return;
      }

      const offerButton = event.target.closest("[data-offer-index]");

      if (offerButton) {
        selectedOffer =
          demoOffers[Number(offerButton.dataset.offerIndex)] || null;

        if (!selectedOffer) {
          return;
        }

        renderSelectedOffer(selectedOffer);
        showStep(6);
      }
    });

    searchButton.addEventListener("click", () => {
      const stepTwo = modal.querySelector('.hepon-step[data-step="2"]');

      if (!validateContainer(stepTwo)) {
        return;
      }

      sendOtp().catch((error) => {
        console.error(error);
        alert(
          "Doğrulama kodu gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
        );
        showStep(2);
      });
    });


    otpBack.addEventListener("click", () => {
      window.clearInterval(otpInterval);
      clearOtpMessage();
      showStep(2);
    });

    otpResend.addEventListener("click", () => {
      sendOtp().catch((error) => {
        console.error(error);
        setOtpMessage(
          "Kod yeniden gönderilemedi. Lütfen tekrar deneyin.",
          "error"
        );
      });
    });

    verifyOtpButton.addEventListener("click", () => {
      verifyOtp();
    });

    otpCode.addEventListener("input", () => {
      otpCode.value = otpCode.value.replace(/\D/g, "").slice(0, 6);
    });

    restartButton.addEventListener("click", () => {
      selectedOffer = null;
      showStep(1);
    });


    backToOffersButton.addEventListener("click", () => {
      clearFinalStatus();
      showStep(5);
    });

    goToCompanyPaymentButton.addEventListener("click", () => {
      redirectToCompanyPayment();
    });



    document.addEventListener("input", (event) => {
      if (event.target.id === "hepon_document_series") {
        event.target.value = event.target.value
          .replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "")
          .toLocaleUpperCase("tr-TR")
          .slice(0, 2);
      }

      if (event.target.id === "hepon_document_number") {
        event.target.value = event.target.value
          .replace(/\D/g, "")
          .slice(0, 6);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("is-open")
      ) {
        closeModal();
      }
    });
  })();
