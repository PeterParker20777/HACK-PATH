
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const characters = "アァイィウヴエェオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\";
const fontSize = 14;

let columns = 0;
let drops = [];
let matrixWidth = 0;
let matrixHeight = 0;

function resizeMatrix() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;

    canvas.width = matrixWidth * ratio;
    canvas.height = matrixHeight * ratio;

    canvas.style.width = `${matrixWidth}px`;
    canvas.style.height = `${matrixHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    columns = Math.floor(matrixWidth / fontSize);
    drops = Array.from(
        { length: columns },
        () => Math.random() * (matrixHeight / fontSize)
    );
}

function drawMatrix() {
    ctx.fillStyle = "rgba(5, 8, 7, 0.075)";
    ctx.fillRect(0, 0, matrixWidth, matrixHeight);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const character = characters.charAt(
            Math.floor(Math.random() * characters.length)
        );

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.975
            ? "rgba(150, 255, 190, 0.9)"
            : "rgba(57, 255, 136, 0.65)";

        ctx.fillText(character, x, y);

        if (y > matrixHeight && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += 0.45;
    }
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);
setInterval(drawMatrix, 45);

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

    document.title = isArabic
        ? "HACK PATH | أكاديمية التكنولوجيا"
        : "HACK PATH | Digital Academy";

    localStorage.setItem("hackPathLanguage", language);
}

const savedLanguage = localStorage.getItem("hackPathLanguage") || "en";
setLanguage(savedLanguage);

languageSwitch.addEventListener("click", () => {
    const currentLanguage = document.documentElement.lang;
    setLanguage(currentLanguage === "en" ? "ar" : "en");
});

/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

/* ACTIVE NAVIGATION */

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let currentSection = "home";

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
});

/* INFORMATION MODAL */

const modal = document.getElementById("infoModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

function openModal() {
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("loginButton").addEventListener("click", event => {
    event.preventDefault();
    openModal();
});

document.getElementById("contactButton").addEventListener("click", event => {
    event.preventDefault();
    openModal();
});

document.querySelectorAll(".course-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        openModal();
    });
});

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});
