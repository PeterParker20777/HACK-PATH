/* About us: flip cards (click / Enter / Space), soft 3D tilt, social links from config.js */
document.querySelectorAll(".team-card").forEach(card => {
    const links = (typeof SOCIALS !== "undefined" && SOCIALS[card.dataset.member]) || {};
    card.querySelectorAll("[data-social]").forEach(a => {
        const url = links[a.dataset.social];
        if (url) a.href = url;
        else { a.classList.add("off"); a.removeAttribute("href"); }
        a.addEventListener("click", e => e.stopPropagation());
    });

    const flip = () => {
        const on = card.classList.toggle("flipped");
        card.setAttribute("aria-pressed", on);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
    };
    card.addEventListener("click", flip);
    card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });

    if (window.matchMedia("(hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        card.addEventListener("mousemove", e => {
            if (card.classList.contains("flipped")) return;
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            card.style.setProperty("--ry", `${x * 14}deg`);
            card.style.setProperty("--rx", `${-y * 14}deg`);
        });
        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    }
});
