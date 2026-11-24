/* LANGUAGE SWITCH */

const languageSwitch = document.getElementById("languageSwitch");
const languageLabel = document.getElementById("languageLabel");

function setLanguage(language) {
    const isArabic = language === "ar";

    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.dir = isArabic ? "rtl" : "ltr";

    document.querySelectorAll("[data-en][data-ar]").forEach(element => {
        element.textContent = element.dataset[language];
    });

    languageLabel.textContent = isArabic ? "EN" : "AR";

    const pageTitle = document.body.dataset;
    document.title = isArabic
        ? (pageTitle.titleAr || "CYBER PATH | تعلّم. اكتشف. أمّن.")
        : (pageTitle.titleEn || "CYBER PATH | Learn. Explore. Secure.");

    document.dispatchEvent(new Event("languagechange"));
    localStorage.setItem("cyberPathLanguage", language);
}

const savedLanguage = localStorage.getItem("cyberPathLanguage") || "en";
setLanguage(savedLanguage);

languageSwitch.addEventListener("click", () => {
    const currentLanguage = document.documentElement.lang;
    setLanguage(currentLanguage === "en" ? "ar" : "en");
});

