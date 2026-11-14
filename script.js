const matrixCanvas = document.getElementById("matrix");
const matrixContext = matrixCanvas.getContext("2d");

const matrixCharacters = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
let matrixFontSize = 14;
let matrixColumns = 0;
let matrixDrops = [];

function resizeMatrix() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    matrixCanvas.width = Math.floor(window.innerWidth * ratio);
    matrixCanvas.height = Math.floor(window.innerHeight * ratio);
    matrixCanvas.style.width = `${window.innerWidth}px`;
    matrixCanvas.style.height = `${window.innerHeight}px`;
    matrixContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    matrixColumns = Math.ceil(window.innerWidth / matrixFontSize);
    matrixDrops = Array.from({ length: matrixColumns }, () => Math.random() * -80);
}

function drawMatrix() {
    matrixContext.fillStyle = "rgba(5, 8, 7, 0.075)";
    matrixContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    matrixContext.font = `${matrixFontSize}px monospace`;
    matrixContext.fillStyle = "#39ff88";

    for (let i = 0; i < matrixDrops.length; i++) {
        const character = matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
        const x = i * matrixFontSize;
        const y = matrixDrops[i] * matrixFontSize;

        matrixContext.fillText(character, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }

        matrixDrops[i] += Math.random() > 0.94 ? 1.8 : 0.8;
    }
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);
window.setInterval(drawMatrix, 42);

const languageSwitch = document.getElementById("languageSwitch");
const languageLabel = document.getElementById("languageLabel");
let currentLanguage = localStorage.getItem("cyberPathLanguage") || "en";

function setLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    languageLabel.textContent = language === "en" ? "AR" : "EN";

    document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
        const value = element.dataset[language];
        if (value !== undefined) {
            element.innerHTML = value;
        }
    });

    localStorage.setItem("cyberPathLanguage", language);
}

languageSwitch.addEventListener("click", () => {
    setLanguage(currentLanguage === "en" ? "ar" : "en");
});

setLanguage(currentLanguage);

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

function updateActiveNavigation() {
    let activeSection = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            activeSection = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeSection}`);
    });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
updateActiveNavigation();

const modal = document.getElementById("infoModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");
const modalIcon = document.getElementById("modalIcon");
const modalLabel = document.getElementById("modalLabel");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");

const courseInformation = {
    basics: {
        icon: "⌘",
        label: {
            en: "FREE COURSE / COURSE_001",
            ar: "كورس مجاني / COURSE_001"
        },
        title: {
            en: "Basics of Cyber Security",
            ar: "أساسيات الأمن السيبراني"
        },
        description: {
            en: "A beginner-friendly introduction to the core concepts you need before moving deeper into cybersecurity.",
            ar: "مقدمة مناسبة للمبتدئين عن المفاهيم الأساسية اللي هتحتاجها قبل ما تتعمق في مجال الأمن السيبراني."
        },
        modules: [
            ["Networking Basics", "أساسيات الشبكات"],
            ["Linux", "لينكس"],
            ["Cryptography", "التشفير"],
            ["Web Basics", "أساسيات الويب"]
        ],
        free: true
    },
    "web-pentest": {
        icon: "⌬",
        label: {
            en: "PAID COURSE / COURSE_002",
            ar: "كورس مدفوع / COURSE_002"
        },
        title: {
            en: "Web Application Penetration Testing",
            ar: "اختبار اختراق تطبيقات الويب"
        },
        description: {
            en: "A focused learning path about assessing web application security and understanding common vulnerabilities. Enrollment and payment are arranged through platform support.",
            ar: "مسار تعليمي متخصص في تقييم أمان تطبيقات الويب وفهم الثغرات الشائعة. الاشتراك والدفع بيتم الاتفاق عليهم من خلال دعم المنصة."
        },
        modules: [
            ["Web Application Security", "أمن تطبيقات الويب"],
            ["Testing Methodology", "منهجية الاختبار"],
            ["Vulnerability Analysis", "تحليل الثغرات"]
        ],
        free: false
    }
};

function openCourseModal(courseKey) {
    const course = courseInformation[courseKey];
    if (!course) return;

    modalIcon.textContent = course.icon;
    modalLabel.textContent = course.label[currentLanguage];
    modalTitle.textContent = course.title[currentLanguage];
    modalDescription.textContent = course.description[currentLanguage];

    modalDetails.innerHTML = course.modules.map((module, index) => {
        const title = module[currentLanguage];
        return `<div class="modal-module"><span>${String(index + 1).padStart(2, "0")}</span><strong>${title}</strong></div>`;
    }).join("");

    modalOk.querySelector("span").textContent = currentLanguage === "en" ? "GOT IT" : "تمام";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modalClose.focus();
}

function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

document.querySelectorAll(".course-action").forEach((button) => {
    button.addEventListener("click", () => openCourseModal(button.dataset.course));
});

document.getElementById("loginButton").addEventListener("click", () => {
    modalIcon.textContent = "↗";
    modalLabel.textContent = currentLanguage === "en" ? "STUDENT AREA" : "منطقة الطلاب";
    modalTitle.textContent = currentLanguage === "en" ? "Student Portal" : "بوابة الطلاب";
    modalDescription.textContent = currentLanguage === "en"
        ? "Student registration, login, course access, and the learning dashboard will be available here."
        : "تسجيل الطلاب وتسجيل الدخول والوصول للكورسات ولوحة التعلم هتكون متاحة هنا.";
    modalDetails.innerHTML = "";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modalClose.focus();
});

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
});

const eggStyle = document.createElement("style");
eggStyle.textContent = `
    .egg-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        overflow: hidden;
        pointer-events: none;
        background: rgba(0, 5, 2, 0.94);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .egg-rain {
        position: absolute;
        top: -12vh;
        color: #39ff88;
        font-family: monospace;
        font-weight: 900;
        text-shadow: 0 0 12px #39ff88;
        animation: egg-fall linear forwards;
        white-space: nowrap;
    }
    .egg-giant {
        position: relative;
        z-index: 2;
        font-size: clamp(110px, 25vw, 260px);
        opacity: 0;
        transform: translateY(-120vh) scale(.45);
        filter: drop-shadow(0 0 35px rgba(57,255,136,.7));
        animation: egg-drop 1s cubic-bezier(.18,.8,.2,1) forwards;
    }
    .egg-giant.duck {
        filter: grayscale(1) brightness(0) drop-shadow(0 0 28px rgba(57,255,136,.65));
    }
    .egg-particle {
        position: absolute;
        z-index: 3;
        font-size: 25px;
        animation: egg-burst 1.25s ease-out forwards;
    }
    @keyframes egg-fall {
        to { transform: translateY(125vh); }
    }
    @keyframes egg-drop {
        0% { opacity: 0; transform: translateY(-120vh) scale(.45) rotate(-20deg); }
        75% { opacity: 1; transform: translateY(3vh) scale(1.08) rotate(5deg); }
        100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
    }
    @keyframes egg-burst {
        0% { opacity: 1; transform: translate(0,0) scale(1.2) rotate(0); }
        100% { opacity: 0; transform: translate(var(--dx),var(--dy)) scale(.15) rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
        .egg-rain, .egg-giant, .egg-particle { animation-duration: .01ms !important; }
    }
`;
document.head.appendChild(eggStyle);

let typingBuffer = "";
let eggRunning = false;

function launchEasterEgg(type) {
    if (eggRunning) return;
    eggRunning = true;

    const isDuck = type === "blackduck";
    const overlay = document.createElement("div");
    overlay.className = "egg-overlay";
    document.body.appendChild(overlay);

    const symbols = isDuck ? ["🦆", "◆", "▪"] : ["🕷️", "⌘", "⌬"];
    const rainInterval = window.setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const drop = document.createElement("span");
            drop.className = "egg-rain";
            drop.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.fontSize = `${18 + Math.random() * 24}px`;
            drop.style.animationDuration = `${1.2 + Math.random() * 2.2}s`;
            overlay.appendChild(drop);
            window.setTimeout(() => drop.remove(), 3600);
        }
    }, 75);

    window.setTimeout(() => {
        window.clearInterval(rainInterval);
        overlay.querySelectorAll(".egg-rain").forEach((item) => item.remove());

        const giant = document.createElement("div");
        giant.className = `egg-giant${isDuck ? " duck" : ""}`;
        giant.textContent = isDuck ? "🦆" : "🕷️";
        overlay.appendChild(giant);

        window.setTimeout(() => {
            const bounds = giant.getBoundingClientRect();
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;
            giant.remove();

            for (let i = 0; i < 34; i++) {
                const particle = document.createElement("span");
                particle.className = "egg-particle";
                particle.textContent = isDuck ? "🦆" : "🕷️";
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.setProperty("--dx", `${(Math.random() - 0.5) * window.innerWidth * 1.2}px`);
                particle.style.setProperty("--dy", `${(Math.random() - 0.5) * window.innerHeight * 1.2}px`);
                overlay.appendChild(particle);
            }

            window.setTimeout(() => {
                overlay.remove();
                eggRunning = false;
            }, 1450);
        }, 1450);
    }, 5000);
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const target = event.target;
    if (target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
    )) {
        return;
    }

    if (event.key.length !== 1) return;

    typingBuffer = (typingBuffer + event.key.toLowerCase()).slice(-11);

    if (typingBuffer.endsWith("blackduck")) {
        typingBuffer = "";
        launchEasterEgg("blackduck");
    } else if (typingBuffer.endsWith("peterparker")) {
        typingBuffer = "";
        launchEasterEgg("peterparker");
    }
});
