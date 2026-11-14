/* About us: trading-card style team cards (tilt on mouse move, flip on click) */
const SOCIAL_ICONS = {
    instagram: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M4 9h4v11H4zM6 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM10 9h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 3.6 0 4.4 2.3 4.4 5.4V20h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2.2 1.4-2.2 2.8V20h-4z"/></svg>'
};
const SOCIAL_NAMES = { instagram: "Instagram", linkedin: "LinkedIn" };

function socialLink(kind, url) {
    return url
        ? `<a class="team-social" href="${url}" target="_blank" rel="noopener" aria-label="${SOCIAL_NAMES[kind]}">${SOCIAL_ICONS[kind]}</a>`
        : `<span class="team-social off" aria-label="${SOCIAL_NAMES[kind]} (soon)">${SOCIAL_ICONS[kind]}</span>`;
}

function teamCard(m) {
    return `
    <div class="team-card" tabindex="0" role="button" aria-label="${m.name}">
        <div class="team-tilt"><div class="team-flip">
            <div class="team-face"><div class="face-body">
                <div class="team-photo">
                    <span class="photo-fallback${m.black ? " black" : ""}">${m.fallback}</span>
                    <img src="${m.photo}" alt="${m.name}" onerror="this.remove()">
                </div>
                <h3 class="team-name">${m.name}</h3>
                <span class="team-hint" data-en="CLICK ME" data-ar="اضغط هنا">CLICK ME</span>
            </div></div>
            <div class="team-face back"><div class="face-body">
                <h3 class="team-name">${m.name}</h3>
                <span class="team-role" ${attrs(m.role)}>${m.role.en}</span>
                <div class="team-socials">${socialLink("instagram", m.instagram)}${socialLink("linkedin", m.linkedin)}</div>
                <span class="team-hint small" data-en="CLICK TO FLIP BACK" data-ar="اضغط للرجوع">CLICK TO FLIP BACK</span>
            </div></div>
        </div></div>
    </div>`;
}

const teamGrid = document.getElementById("teamGrid");
teamGrid.innerHTML = TEAM.map(teamCard).join("");

const canTilt = window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

teamGrid.querySelectorAll(".team-card").forEach(card => {
    const flip = card.querySelector(".team-flip");
    const toggle = () => {
        flip.classList.toggle("flipped");
        card.classList.remove("burst");
        void card.offsetWidth;
        card.classList.add("burst");
        setTimeout(() => card.classList.remove("burst"), 750);
    };
    card.addEventListener("click", e => { if (!e.target.closest("a")) toggle(); });
    card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    if (!canTilt) return;
    card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.classList.add("moving");
        card.style.setProperty("--ry", `${(x - 0.5) * 26}deg`);
        card.style.setProperty("--rx", `${(0.5 - y) * 26}deg`);
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
        card.classList.remove("moving");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
    });
});
