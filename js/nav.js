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

if (sections.length) window.addEventListener("scroll", () => {
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

