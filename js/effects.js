/* Scroll progress bar, reveal on scroll, clickable signature */
const progressBar = document.getElementById("scrollProgress");
function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".section-heading, .course-filters, .course-card, .about-visual, .about-content, .feature, .contact-box").forEach((el, i) => {
        el.classList.add("reveal");
        el.style.animationDelay = `${(i % 3) * 90}ms`;
        observer.observe(el);
    });
}

const signature = document.getElementById("signature");
const triggerSpider = () => createEasterEgg("peterparker");
signature.addEventListener("click", triggerSpider);
signature.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerSpider(); }
});

document.getElementById("duckBadge").addEventListener("click", () => createEasterEgg("blackduck"));
