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

let activeGroup = null;
let activeFilter = "all";
const matches = c => activeFilter === "all" || c.type === activeFilter;

function categoryCards() {
    return CATEGORIES.map((g, i) => {
        const all = COURSES.filter(c => c.group === g.id);
        const free = all.filter(c => c.type === "free").length, paid = all.length - free;
        const shown = all.filter(matches).length;
        const link = !all.length ? { en: "COMING SOON", ar: "قريباً" }
            : shown ? { en: "VIEW COURSES", ar: "شوف الكورسات" }
            : { en: "NO MATCHING COURSES", ar: "مفيش كورسات مطابقة" };
        const count = { en: `${all.length} COURSES`, ar: `${all.length} كورس` };
        const tag = (n, type) => n ? `<span class="badge ${type}" data-en="${n} ${TYPE[type].en}" data-ar="${n} ${TYPE[type].ar}">${n} ${TYPE[type].en}</span>` : "";
        return `
        <article class="course-card category-card${shown ? "" : " soon"}"${shown ? ` tabindex="0" role="button" data-group="${g.id}"` : ""}>
            <div class="course-top"><span class="course-number">0${i + 1}</span><span class="course-icon">${g.icon}</span></div>
            <div class="course-art"><span class="art-symbol">${g.symbol}</span><span class="art-code">${g.code}</span></div>
            <div class="course-info">
                <span class="course-category" ${attrs(count)}>${count.en}</span>
                <h3 ${attrs(g.title)}>${g.title.en}</h3>
                <div class="course-meta">${tag(free, "free")}${tag(paid, "paid")}</div>
                <p ${attrs(g.desc)}>${g.desc.en}</p>
                <span class="course-link"><span ${attrs(link)}>${link.en}</span><span>↗</span></span>
            </div>
        </article>`;
    }).join("");
}

function renderCourses() {
    document.getElementById("catBack").style.display = activeGroup ? "" : "none";
    document.querySelectorAll("#courseFilters [data-filter]").forEach(x => x.classList.toggle("active", x.dataset.filter === activeFilter));
    const grid = document.getElementById("coursesGrid");
    if (!activeGroup) { grid.innerHTML = categoryCards(); return; }
    const list = COURSES.filter(c => c.group === activeGroup && matches(c));
    grid.innerHTML = list.length ? list.map((c, i) => `
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
        </article>`).join("")
        : `<p class="grid-empty" data-en="No courses match this filter." data-ar="مفيش كورسات مطابقة للفلتر ده.">No courses match this filter.</p>`;
}

function setGroup(id) {
    activeGroup = id;
    renderCourses();
    setLanguage(currentLang());
    document.getElementById("courses").scrollIntoView();
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
const openCard = card => {
    if (card.dataset.group) setGroup(card.dataset.group);
    else if (card.dataset.course) showCourse(card.dataset.course);
};
grid.addEventListener("click", e => {
    const card = e.target.closest(".course-card");
    if (card) openCard(card);
});
grid.addEventListener("keydown", e => {
    const card = e.target.closest(".course-card");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCard(card); }
});
document.getElementById("catBack").addEventListener("click", () => setGroup(null));

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

document.getElementById("courseFilters").addEventListener("click", e => {
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    renderCourses();
    setLanguage(currentLang());
});
