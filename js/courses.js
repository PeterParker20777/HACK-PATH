/* Course cards, course details modal, WhatsApp requests */
const currentLang = () => (document.documentElement.lang === "ar" ? "ar" : "en");
const attrs = o => `data-en="${o.en}" data-ar="${o.ar}"`;
const TYPE = { free: { en: "FREE", ar: "مجاني" }, paid: { en: "PAID", ar: "مدفوع" } };
const LINE = "━━━━━━━━━━━━━━";

function whatsappUrl(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function courseMessage(course) {
    const L = currentLang(), ar = L === "ar";
    return [
        ar ? `مرحباً ${BRAND} 👋` : `Hello ${BRAND} 👋`, LINE,
        ar ? "📚 طلب كورس" : "📚 Course Request",
        `${ar ? "الكورس" : "Course"}: ${course.title[L]}`,
        `${ar ? "المستوى" : "Level"}: ${course.level[L]}`,
        `${ar ? "النوع" : "Type"}: ${TYPE[course.type][L]}`, LINE,
        `👤 ${ar ? "الاسم" : "Name"}: `,
        `📧 ${ar ? "الإيميل" : "Email"}: `, LINE,
        ar ? "أرجو التواصل معي لإتمام التسجيل. شكراً 🙏" : "Please contact me to complete the enrollment. Thank you 🙏",
        `🌐 ${ar ? "أُرسلت من موقع" : "Sent from"} ${BRAND}`
    ].join("\n");
}

function generalMessage() {
    return currentLang() === "ar"
        ? `مرحباً ${BRAND} 👋\nعايز أستفسر عن الكورسات والاشتراك.\n👤 الاسم: \n🌐 أُرسلت من موقع ${BRAND}`
        : `Hello ${BRAND} 👋\nI would like to ask about the courses and enrollment.\n👤 Name: \n🌐 Sent from ${BRAND}`;
}

function badges(course) {
    return `<span class="badge ${course.type}" ${attrs(TYPE[course.type])}>${TYPE[course.type].en}</span>
            <span class="badge" ${attrs(course.level)}>${course.level.en}</span>`;
}

function courseCard(c, i) {
    return `
        <article class="course-card${c.featured ? " featured-card" : ""}" tabindex="0" role="button" data-course="${c.id}">
            <div class="course-top"><span class="course-number">0${i + 1}</span><span class="course-icon">${c.icon}</span></div>
            <div class="course-art"><span class="art-symbol">${c.symbol}</span><span class="art-code">${c.code}</span></div>
            <div class="course-info">
                <span class="course-category" ${attrs(c.category)}>${c.category.en}</span>
                <h3 ${attrs(c.title)}>${c.title.en}</h3>
                <div class="course-meta">${badges(c)}</div>
                <p ${attrs(c.desc)}>${c.desc.en}</p>
                <span class="course-link"><span data-en="VIEW DETAILS" data-ar="التفاصيل">VIEW DETAILS</span><span>↗</span></span>
            </div>
        </article>`;
}

let activeCat = null, activeFilter = "all";

function panelHtml() {
    const cat = CATEGORIES.find(x => x.id === activeCat);
    if (!cat) return "";
    const all = COURSES.filter(x => x.track === cat.id);
    const shown = all.filter(x => activeFilter === "all" || x.type === activeFilter);
    const empty = all.length ? { en: "NO MATCHING COURSES", ar: "لا توجد كورسات مطابقة" } : { en: "COMING SOON", ar: "قريباً" };
    const chip = (f, o) => `<button type="button" class="filter-chip${activeFilter === f ? " active" : ""}" data-filter="${f}" ${attrs(o)}>${o.en}</button>`;
    return `<div class="category-panel" id="categoryPanel">
        <div class="panel-head">
            <h3 class="panel-title" ${attrs(cat.title)}>${cat.title.en}</h3>
            <div class="course-filters">${chip("all", { en: "ALL", ar: "الكل" })}${chip("free", TYPE.free)}${chip("paid", TYPE.paid)}</div>
            <button type="button" class="panel-close" data-close="1" aria-label="Close">&times;</button>
        </div>
        ${shown.length ? `<div class="courses-grid">${shown.map(courseCard).join("")}</div>` : `<div class="category-empty" ${attrs(empty)}>${empty.en}</div>`}
    </div>`;
}

function renderCourses() {
    const cards = CATEGORIES.map((cat, n) => {
        const total = COURSES.filter(x => x.track === cat.id).length;
        const count = { en: `${total} COURSE${total === 1 ? "" : "S"}`, ar: `${total} كورس` };
        return `<article class="category-card${cat.id === activeCat ? " active" : ""}" tabindex="0" role="button" data-cat="${cat.id}">
            <span class="category-number">0${n + 1}</span>
            <h3 class="category-title" ${attrs(cat.title)}>${cat.title.en}</h3>
            <p class="category-desc" ${attrs(cat.desc)}>${cat.desc.en}</p>
            <div class="category-foot"><span class="category-count" ${attrs(count)}>${count.en}</span><span class="category-open"><span data-en="VIEW COURSES" data-ar="شوف الكورسات">VIEW COURSES</span><span>↗</span></span></div>
        </article>`;
    }).join("");
    document.getElementById("coursesGrid").innerHTML = `<div class="category-cards">${cards}</div>${panelHtml()}`;
}

function refreshCourses(scroll) {
    renderCourses();
    setLanguage(currentLang());
    if (scroll) document.getElementById("categoryPanel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const courseModal = document.getElementById("courseModal");
let openCourseId = null;

function fillCourseModal(course) {
    const L = currentLang(), $ = id => document.getElementById(id);
    $("cmCategory").textContent = "// " + course.category[L];
    $("cmTitle").textContent = course.title[L];
    $("cmMeta").innerHTML = badges(course);
    $("cmDesc").textContent = course.desc[L];
    $("cmModules").innerHTML = course.modules.map(m => `<li>${m[L]}</li>`).join("");
    $("cmLearn").innerHTML = course.learn.map(m => `<li>${m[L]}</li>`).join("");
    $("cmRequest").href = whatsappUrl(courseMessage(course));
    $("cmMeta").querySelectorAll("[data-en]").forEach(e => (e.textContent = e.dataset[L]));
}

function showCourse(id) {
    openCourseId = id;
    fillCourseModal(COURSES.find(c => c.id === id));
    courseModal.classList.add("show");
}

function hideCourse() {
    openCourseId = null;
    courseModal.classList.remove("show");
}

renderCourses();

const grid = document.getElementById("coursesGrid");
grid.addEventListener("click", e => {
    const chip = e.target.closest("[data-filter]");
    if (chip) { activeFilter = chip.dataset.filter; return refreshCourses(false); }
    if (e.target.closest("[data-close]")) { activeCat = null; return refreshCourses(false); }
    const card = e.target.closest(".course-card");
    if (card) return showCourse(card.dataset.course);
    const cat = e.target.closest(".category-card");
    if (cat) {
        activeCat = activeCat === cat.dataset.cat ? null : cat.dataset.cat;
        activeFilter = "all";
        refreshCourses(Boolean(activeCat));
    }
});
grid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const target = e.target.closest(".course-card, .category-card");
    if (target) { e.preventDefault(); target.click(); }
});

document.getElementById("courseModalClose").addEventListener("click", hideCourse);
courseModal.addEventListener("click", e => { if (e.target === courseModal) hideCourse(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") hideCourse(); });
document.addEventListener("languagechange", () => {
    if (openCourseId) fillCourseModal(COURSES.find(c => c.id === openCourseId));
    const wa = whatsappUrl(generalMessage());
    document.getElementById("footerWhatsapp").href = wa;
    document.getElementById("waFloat").href = wa;
});

document.getElementById("contactButton").addEventListener("click", e => {
    e.preventDefault();
    window.open(whatsappUrl(generalMessage()), "_blank", "noopener");
});
