/* CYBER PATH portal: login, register, dashboard, course player, admin (Supabase) */
import {db} from './supabase.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const app = $('#app'), page = document.body.dataset.page;
const lang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const check = r => { if (r.error) throw r.error; return r.data; };

/* Bilingual text: rendered in the current language, switched by i18n.js through data-en / data-ar */
const T = (en, ar, tag = 'span', cls = '') =>
    `<${tag}${cls ? ` class="${cls}"` : ''} data-en="${esc(en)}" data-ar="${esc(ar)}">${esc(lang() === 'ar' ? ar : en)}</${tag}>`;

function say(m, kind = '') {
    let s = $('#status');
    if (!s) { app.insertAdjacentHTML('afterbegin', '<div id="status" class="status" role="status"></div>'); s = $('#status'); }
    if (!m) { s.hidden = true; return; }
    s.hidden = false; s.className = 'status ' + kind;
    if (Array.isArray(m)) { s.dataset.en = m[0]; s.dataset.ar = m[1]; s.textContent = m[lang() === 'ar' ? 1 : 0]; }
    else { delete s.dataset.en; delete s.dataset.ar; s.textContent = m; }
}

/* Building blocks (same look as the homepage) */
const head = (label, labelAr, a, aa, b = '', ba = '') =>
    `<div class="section-heading"><div>${T(label, labelAr, 'p', 'section-label')}<h2>${T(a, aa)} ${b ? T(b, ba, 'span', 'green') : ''}</h2></div></div><div id="status" class="status" role="status" hidden></div>`;
const panel = (title, body, cls = '') =>
    `<section class="panel ${cls}"><div class="panel-top">${T(title[0], title[1])}<span class="terminal-dots">● ● ●</span></div><div class="panel-body">${body}</div></section>`;
const field = (name, type, en, ar, extra = '') =>
    `<label class="field">${T(en, ar)}<input name="${name}" type="${type}" required ${extra}></label>`;
const select = (name, en, ar, opts) =>
    `<label class="field">${T(en, ar)}<select name="${name}" required>${opts.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></label>`;
const btn = (en, ar, cls = 'primary-button', val = '') =>
    `<button class="${cls}" type="submit"${val ? ` value="${val}"` : ''}>${T(en, ar)}<span>↗</span></button>`;

function onSubmit(form, fn) {
    form.onsubmit = async e => {
        e.preventDefault();
        const action = e.submitter?.value, buttons = $$('#' + form.id + ' button');
        buttons.forEach(b => b.disabled = true);
        try { await fn(new FormData(form), action); }
        catch (err) { say(err.message || String(err), 'err'); }
        finally { buttons.forEach(b => b.disabled = false); }
    };
}

/* WhatsApp buttons (same message style as the homepage) */
function whatsapp() {
    const ar = lang() === 'ar';
    const msg = ar
        ? `مرحباً ${BRAND} 👋\nعايز أستفسر عن الكورسات والاشتراك.\n🌐 أُرسلت من موقع ${BRAND}`
        : `Hello ${BRAND} 👋\nI would like to ask about the courses and enrollment.\n🌐 Sent from ${BRAND}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    $('#waFloat').href = url; $('#footerWhatsapp').href = url;
}
whatsapp();
document.addEventListener('languagechange', whatsapp);

/* Navbar state: logout button + admin link */
async function chrome(user) {
    if (!user) return false;
    const a = $('#authLink'), s = a.querySelector('span');
    s.dataset.en = 'LOGOUT'; s.dataset.ar = 'تسجيل الخروج'; s.textContent = s.dataset[lang()];
    a.href = '#';
    a.onclick = async e => {
        e.preventDefault();
        try { check(await db.auth.signOut()); location.href = 'login.html'; } catch (err) { say(err.message, 'err'); }
    };
    try { const admin = check(await db.rpc('is_admin')); $('#adminLink').hidden = !admin; return admin; }
    catch { return false; }
}

/* LOGIN / REGISTER */
function authPage(reg) {
    app.innerHTML = head('// ACCESS CONTROL', '// التحكم في الدخول', reg ? 'START YOUR' : 'ACCESS YOUR', reg ? 'ابدأ' : 'ادخل على', 'PATH.', 'طريقك.') +
        `<div class="auth">${panel(['AUTH_TERMINAL', 'بوابة الدخول'],
            `<form id="authForm">
                ${reg ? field('name', 'text', 'Full name', 'الاسم بالكامل', 'autocomplete="name"') : ''}
                ${field('email', 'email', 'Email', 'الإيميل', 'autocomplete="email"')}
                ${field('password', 'password', 'Password', 'كلمة المرور', `minlength="6" autocomplete="${reg ? 'new' : 'current'}-password"`)}
                ${reg ? btn('CREATE ACCOUNT', 'إنشاء حساب') : btn('LOGIN', 'تسجيل الدخول')}
            </form>
            <a class="alt-link" href="${reg ? 'login.html' : 'register.html'}">${reg ? T('ALREADY REGISTERED? LOGIN', 'عندك حساب؟ سجّل دخول') : T('NEW HERE? CREATE AN ACCOUNT', 'جديد هنا؟ أنشئ حساب')}</a>`)}</div>`;

    onSubmit($('#authForm'), async f => {
        const email = f.get('email'), password = f.get('password');
        if (reg) {
            const d = check(await db.auth.signUp({email, password, options: {data: {full_name: f.get('name')}, emailRedirectTo: new URL('dashboard.html', location.href).href}}));
            if (!d.session) { say(['Check your email to confirm your account.', 'راجع إيميلك عشان تأكد حسابك.'], 'ok'); return; }
        } else check(await db.auth.signInWithPassword({email, password}));
        location.href = 'dashboard.html';
    });
}

/* DASHBOARD */
async function dashboard(user) {
    const rows = check(await db.from('enrollments').select('courses(id,title)').eq('user_id', user.id)).filter(r => r.courses);
    app.innerHTML = head('// MY LIBRARY', '// مكتبتي', 'YOUR', '', 'COURSES.', 'كورساتك.');
    if (!rows.length) {
        app.insertAdjacentHTML('beforeend', panel(['EMPTY_LIBRARY', 'مكتبة فاضية'],
            `${T('No courses assigned yet. Contact the administrator.', 'لسه مفيش كورسات متاحة ليك. تواصل مع الإدارة.', 'p')}
             <a class="primary-button" href="index.html#courses">${T('BROWSE COURSES', 'تصفح الكورسات')}<span>↗</span></a>`, 'empty'));
        return;
    }
    app.insertAdjacentHTML('beforeend', `<div class="courses-grid">${rows.map((r, i) => {
        const c = r.courses, m = COURSES.find(x => x.id === c.id), t = m ? m.title : {en: c.title, ar: c.title};
        return `<a class="course-card" href="course.html?id=${encodeURIComponent(c.id)}">
            <div class="course-top"><span class="course-number">0${i + 1}</span><span class="course-icon">${esc(m?.icon || '{ }')}</span></div>
            <div class="course-art"><span class="art-symbol">${esc(m?.symbol || c.title.slice(0, 2).toUpperCase())}</span><span class="art-code">${esc(m?.code || c.id)}</span></div>
            <div class="course-info">
                ${m ? T(m.category.en, m.category.ar, 'span', 'course-category') : ''}
                ${T(t.en, t.ar, 'h3')}
                ${m ? T(m.desc.en, m.desc.ar, 'p') : ''}
                <span class="course-link">${T('OPEN COURSE', 'افتح الكورس')}<span>↗</span></span>
            </div></a>`;
    }).join('')}</div>`);
}

/* COURSE PLAYER */
async function coursePage() {
    const id = new URLSearchParams(location.search).get('id');
    const lessons = id ? check(await db.from('lessons').select('*').eq('course_id', id).order('position')) : [];
    let c = null;
    try { c = check(await db.from('courses').select('id,title').eq('id', id).maybeSingle()); } catch {}
    const m = COURSES.find(x => x.id === id), t = m ? m.title : {en: c?.title || id || '', ar: c?.title || id || ''};
    app.innerHTML = head('// NOW PLAYING', '// بتشاهد الآن', t.en, t.ar);

    if (!lessons.length) {
        say(['No available lessons or access not granted.', 'مفيش دروس متاحة أو لسه الوصول مش متفعّل.'], 'err');
        app.insertAdjacentHTML('beforeend', `<a class="secondary-button" href="dashboard.html">${T('← MY COURSES', '→ كورساتي')}</a>`);
        return;
    }
    app.insertAdjacentHTML('beforeend', `<div class="player">
        <section class="panel"><div class="panel-top"><span id="now"></span><span class="terminal-dots">● ● ●</span></div>
            <video id="video" controls playsinline></video>
            <div class="panel-body player-nav">
                <button class="secondary-button" id="prev" type="button">${T('← PREVIOUS', 'السابق')}</button>
                <button class="primary-button" id="next" type="button">${T('NEXT', 'التالي')}<span>↗</span></button>
            </div></section>
        <aside class="panel"><div class="panel-top">${T('LESSONS', 'الدروس')}<span>${lessons.length}</span></div>
            <div class="lessons">${lessons.map((l, i) => `<button class="lesson" data-i="${i}"><i>${String(i + 1).padStart(2, '0')}</i><span>${esc(l.title)}</span></button>`).join('')}</div></aside>
    </div>`);

    const video = $('#video'); let cur = -1;
    async function play(i, auto) {
        if (i < 0 || i >= lessons.length) return;
        cur = i; say('');
        $$('.lesson').forEach((b, j) => b.classList.toggle('on', j === i));
        $('#now').textContent = lessons[i].title;
        try {
            const d = check(await db.storage.from('course-videos').createSignedUrl(lessons[i].video_path, 3600));
            video.src = d.signedUrl;
            if (auto) video.play().catch(() => {});
        } catch (e) { say(e.message, 'err'); }
    }
    $('.lessons').onclick = e => { const b = e.target.closest('.lesson'); if (b) play(+b.dataset.i, true); };
    $('#prev').onclick = () => play(cur - 1, true);
    $('#next').onclick = () => play(cur + 1, true);
    video.onended = () => play(cur + 1, true);
    play(0, false);
}

/* ADMIN */
async function adminPage() {
    const courses = check(await db.from('courses').select('*')), members = check(await db.from('profiles').select('*')), enr = check(await db.from('enrollments').select('*'));
    const cs = courses.map(x => [x.id, x.title]), ms = members.map(x => [x.id, `${x.full_name || 'Member'} — ${x.id.slice(0, 8)}`]);
    const who = id => members.find(x => x.id === id)?.full_name || id.slice(0, 8), title = id => courses.find(x => x.id === id)?.title || id;
    const stat = (n, en, ar) => `<div class="panel stat"><b>${n}</b>${T(en, ar)}</div>`;

    app.innerHTML = head('// CONTROL ROOM', '// غرفة التحكم', 'ADMIN', 'لوحة', 'DASHBOARD.', 'التحكم.') +
        `<div class="stats">${stat(members.length, 'MEMBERS', 'الأعضاء')}${stat(courses.length, 'COURSES', 'الكورسات')}${stat(enr.length, 'ENROLLMENTS', 'الاشتراكات')}</div>
        <div class="admin-grid">
        ${panel(['MANAGE_ACCESS', 'إدارة الوصول'], `<form id="fAccess">${select('member', 'Member', 'العضو', ms)}${select('course', 'Course', 'الكورس', cs)}
            <div class="btn-row">${btn('GRANT', 'منح', 'primary-button', 'grant')}${btn('REVOKE', 'سحب', 'secondary-button', 'revoke')}</div></form>`)}
        ${panel(['ADD_COURSE', 'إضافة كورس'], `<form id="fCourse">${field('id', 'text', 'Course ID (slug)', 'معرّف الكورس (slug)', 'placeholder="python-basics"')}${field('title', 'text', 'Title', 'العنوان')}${btn('ADD', 'إضافة')}</form>`)}
        ${panel(['UPLOAD_LESSON', 'رفع درس'], `<form id="fLesson">${select('course', 'Course', 'الكورس', cs)}${field('title', 'text', 'Lesson title', 'عنوان الدرس')}${field('position', 'number', 'Order', 'الترتيب', 'min="0"')}${field('video', 'file', 'Video file', 'ملف الفيديو', 'accept="video/*"')}${btn('UPLOAD', 'رفع')}</form>`, 'wide')}
        ${panel(['ENROLLMENTS', 'الاشتراكات'], enr.length ? `<div class="rows">${enr.map(r => `<div class="row"><span class="who">${esc(who(r.user_id))}</span><span class="badge">${esc(title(r.course_id))}</span><button class="mini" data-u="${esc(r.user_id)}" data-c="${esc(r.course_id)}">${T('REVOKE', 'سحب')}</button></div>`).join('')}</div>` : T('No enrollments yet.', 'مفيش اشتراكات لسه.', 'p'), 'wide')}
        </div>`;

    const refresh = async msg => { await adminPage(); say(msg, 'ok'); };

    onSubmit($('#fAccess'), async (f, act) => {
        const row = {user_id: f.get('member'), course_id: f.get('course')};
        check(await (act === 'grant' ? db.from('enrollments').upsert(row) : db.from('enrollments').delete().match(row)));
        await refresh(['Access updated.', 'تم تحديث الوصول.']);
    });
    onSubmit($('#fCourse'), async f => {
        if (!/^[a-z0-9-]+$/.test(f.get('id'))) throw Error(lang() === 'ar' ? 'استخدم حروف إنجليزية صغيرة وأرقام وشرطات فقط.' : 'Use lowercase letters, numbers and hyphens.');
        check(await db.from('courses').insert({id: f.get('id'), title: f.get('title')}));
        await refresh(['Course added.', 'تمت إضافة الكورس.']);
    });
    onSubmit($('#fLesson'), async f => {
        const file = f.get('video');
        if (!file.size || !file.type.startsWith('video/')) throw Error(lang() === 'ar' ? 'اختر ملف فيديو.' : 'Choose a video file.');
        const course = f.get('course'), path = course + '/' + crypto.randomUUID() + '.' + (file.name.split('.').pop().replace(/[^a-zA-Z0-9]/g, '') || 'mp4');
        say(['Uploading…', 'جاري الرفع…']);
        check(await db.storage.from('course-videos').upload(path, file));
        try { check(await db.from('lessons').insert({course_id: course, title: f.get('title'), position: Number(f.get('position')), video_path: path})); }
        catch (e) { await db.storage.from('course-videos').remove([path]); throw e; }
        $('#fLesson').reset();
        say(['Lesson uploaded.', 'تم رفع الدرس.'], 'ok');
    });
    $('.rows')?.addEventListener('click', async e => {
        const b = e.target.closest('.mini'); if (!b) return;
        try { check(await db.from('enrollments').delete().match({user_id: b.dataset.u, course_id: b.dataset.c})); await refresh(['Access updated.', 'تم تحديث الوصول.']); }
        catch (err) { say(err.message, 'err'); }
    });
}

async function main() {
    const {data: {user}} = await db.auth.getUser();
    if (page === 'login' || page === 'register') {
        if (user) { location.replace('dashboard.html'); return; }
        authPage(page === 'register'); return;
    }
    if (!user) { location.replace('login.html'); return; }
    const admin = await chrome(user);
    if (page === 'dashboard') return dashboard(user);
    if (page === 'course') return coursePage();
    app.innerHTML = head('// CONTROL ROOM', '// غرفة التحكم', 'ADMIN', 'لوحة', 'DASHBOARD.', 'التحكم.');
    if (!admin) { say(['Access denied.', 'غير مسموح لك بالدخول.'], 'err'); return; }
    return adminPage();
}
main().catch(e => say(e.message, 'err'));
