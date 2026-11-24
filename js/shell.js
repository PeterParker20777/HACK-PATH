/* Shared layout for portal pages (login, register, dashboard, course, admin).
   Same background, navbar and footer as index.html. Edit here once, all pages follow. */
(() => {
    const page = document.body.dataset.page;
    const d = (en, ar) => `data-en="${en}" data-ar="${ar}"`;
    const link = (href, en, ar, id = "") =>
        `<a href="${href}" class="nav-link${page === id ? " active" : ""}" ${d(en, ar)}>${en}</a>`;

    document.body.insertAdjacentHTML("afterbegin", `
    <div class="scroll-progress" id="scrollProgress"></div>
    <a class="wa-float" id="waFloat" href="#" target="_blank" rel="noopener" aria-label="WhatsApp">💬<span ${d("CHAT WITH US", "كلمنا")}>CHAT WITH US</span></a>
    <canvas id="matrix"></canvas>
    <div class="background-overlay"></div>
    <div class="scanlines"></div>
    <header class="navbar">
        <button class="language-switch" id="languageSwitch" aria-label="Change language">
            <span class="planet-icon">◎</span><span id="languageLabel">AR</span>
        </button>
        <a href="index.html" class="logo"><span class="logo-bracket">[</span>CYBER<span class="green">PATH</span><span class="logo-bracket">]</span></a>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
        <nav class="nav-links" id="navLinks">
            ${link("index.html", "Home", "الرئيسية")}
            ${link("index.html#courses", "Courses", "الكورسات")}
            ${link("dashboard.html", "My Courses", "كورساتي", "dashboard")}
            <a href="admin.html" class="nav-link${page === "admin" ? " active" : ""}" id="adminLink" hidden ${d("Admin", "الأدمن")}>Admin</a>
            <a href="login.html" class="nav-login" id="authLink"><span ${d("LOGIN", "تسجيل الدخول")}>LOGIN</span> <span>↗</span></a>
        </nav>
    </header>`);

    document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
        <div class="footer-top">
            <a href="index.html" class="logo"><span class="logo-bracket">[</span>CYBER<span class="green">PATH</span><span class="logo-bracket">]</span></a>
            <span class="footer-message" ${d("LEARN. EXPLORE. SECURE.", "تعلّم. اكتشف. أمّن.")}>LEARN. EXPLORE. SECURE.</span>
            <a href="#" class="back-top" id="footerWhatsapp" target="_blank" rel="noopener">WHATSAPP ↗</a>
            <a href="#top" class="back-top" ${d("BACK TO TOP ↑", "للأعلى ↑")}>BACK TO TOP ↑</a>
        </div>
        <div class="footer-bottom">
            <span ${d("© 2026 CYBER PATH. ALL RIGHTS RESERVED.", "© 2026 CYBER PATH. جميع الحقوق محفوظة.")}>© 2026 CYBER PATH. ALL RIGHTS RESERVED.</span>
            <div class="signature" id="signature" role="button" tabindex="0" aria-label="Made By PeterParker">
                <span class="sig-kicker">// MADE BY</span>
                <span class="sig-line"><span class="sig-name">PeterParker</span><span class="sig-thread"><span class="sig-spider">🕷️</span></span></span>
            </div>
        </div>
    </footer>`);
})();
