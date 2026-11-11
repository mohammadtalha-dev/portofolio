/* ============ Portfolio engine ============ */
const BAKED_DATA = null; // @@BAKED@@

const KEY = 'pf_data_v1', PWKEY = 'pf_pw_v1', SESSION = 'pf_admin_open';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* page hamesha bilkul upar se khule */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.documentElement.style.scrollBehavior = 'auto';
const toTop = () => { if (!location.hash) window.scrollTo(0, 0); };
toTop();
addEventListener('DOMContentLoaded', toTop);
addEventListener('load', () => {
    toTop(); setTimeout(toTop, 100); setTimeout(toTop, 400);
    setTimeout(() => { toTop(); document.documentElement.style.scrollBehavior = ''; }, 1000);
});

/* ---------- default data (only what you already told me) ---------- */
const DEFAULTS = {
    profile: { name: 'Mohammad Talha', title: 'Full Stack Developer', tagline: '', photo: '', about: '', location: '', email: 'talha.developer1223@gmail.com', whatsapp: '03302413247', resume: '', availability: '' },
    stats: [], socials: [], skills: [], services: [], projects: [], experience: [],
    learning: [
        { topic: 'HTML', status: 'completed', progress: '100', note: '' },
        { topic: 'CSS', status: 'completed', progress: '100', note: '' },
        { topic: 'Tailwind CSS', status: 'completed', progress: '100', note: '' },
        { topic: 'JavaScript', status: 'learning', progress: '', note: '2 chapters done' }
    ]
};

/* ---------- admin form schema: add a field here and it appears everywhere ---------- */
const SCHEMA = {
    profile: {
        label: 'Profile', single: true, fields: [
            { k: 'name', l: 'Full name' }, { k: 'title', l: 'Job title' },
            { k: 'tagline', l: 'Short line under your title', t: 'textarea' },
            { k: 'photo', l: 'Your photo', t: 'image', max: 900 },
            { k: 'about', l: 'About me (full text)', t: 'textarea' },
            { k: 'location', l: 'Location' }, { k: 'availability', l: 'Availability (e.g. Open to work)' },
            { k: 'email', l: 'Email (email form messages arrive here)', t: 'email' },
            { k: 'whatsapp', l: 'WhatsApp number (WhatsApp form opens this chat)' },
            { k: 'resume', l: 'Resume link', t: 'url' }]
    },
    stats: { label: 'Stats', title: 'label', fields: [{ k: 'value', l: 'Number / value' }, { k: 'label', l: 'Label' }] },
    socials: { label: 'Social links', title: 'label', fields: [{ k: 'label', l: 'Name (GitHub, LinkedIn...)' }, { k: 'url', l: 'Link', t: 'url' }] },
    skills: { label: 'Skills', title: 'name', fields: [{ k: 'name', l: 'Skill name' }, { k: 'category', l: 'Group (Frontend, Backend...)' }, { k: 'level', l: 'Level 0-100 (optional)', t: 'number' }] },
    services: { label: 'Services', title: 'title', fields: [{ k: 'icon', l: 'Icon (one emoji)' }, { k: 'title', l: 'Service title' }, { k: 'description', l: 'Description', t: 'textarea' }] },
    projects: {
        label: 'Projects', title: 'title', fields: [
            { k: 'title', l: 'Project name' }, { k: 'description', l: 'Description', t: 'textarea' },
            { k: 'tech', l: 'Tech used (comma separated)' }, { k: 'image', l: 'Screenshot', t: 'image', max: 1100 },
            { k: 'live', l: 'Live link', t: 'url' }, { k: 'repo', l: 'GitHub / code link', t: 'url' }]
    },
    experience: {
        label: 'Experience', title: 'role', fields: [
            { k: 'role', l: 'Role' }, { k: 'org', l: 'Company / place' }, { k: 'period', l: 'Period' }, { k: 'description', l: 'Description', t: 'textarea' }]
    },
    learning: {
        label: 'Learning', title: 'topic', fields: [
            { k: 'topic', l: 'Topic' },
            { k: 'status', l: 'Status', t: 'select', opts: [['completed', 'Completed'], ['learning', 'Learning now'], ['pending', 'Not started yet']] },
            { k: 'progress', l: 'Progress 0-100 (optional)', t: 'number' }, { k: 'note', l: 'Note (e.g. 2 chapters done)' }]
    }
};

/* ---------- storage ---------- */
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function merge(base, extra) {
    const out = clone(base);
    if (!extra) return out;
    for (const k in out) {
        if (extra[k] === undefined) continue;
        out[k] = Array.isArray(out[k]) ? extra[k] : { ...out[k], ...extra[k] };
    }
    return out;
}
function load() {
    try { const s = localStorage.getItem(KEY); if (s) return merge(DEFAULTS, JSON.parse(s)); } catch (e) { }
    return merge(DEFAULTS, BAKED_DATA);
}
let data = load();
function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { toast('Storage full - use smaller images or export a backup.'); }
}

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function url(u) {
    u = String(u || '').trim(); if (!u) return '';
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(u)) return 'https://' + u;
    return '';
}
const has = v => String(v ?? '').trim() !== '';
const isAdmin = () => sessionStorage.getItem(SESSION) === '1';
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3600); }
const cell = (inner, extra = '') => `<div class="cell reveal ${extra}">${inner}</div>`;
const card = (inner, extra = '') => `<article class="card tilt ${extra}">${inner}</article>`;
const btn = (label, href, cls = '') => href ? `<a class="btn ${cls}" href="${esc(href)}" ${/^https?:/.test(href) ? 'target="_blank" rel="noopener"' : ''}>${esc(label)}</a>` : '';
function waNumber(n) { let d = String(n || '').replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); else if (d.startsWith('0')) d = '92' + d.slice(1); return d.length >= 10 ? d : ''; }
function gmailLink(to, subject = '', body = '') {
    return 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(to) + (subject ? '&su=' + encodeURIComponent(subject) : '') + (body ? '&body=' + encodeURIComponent(body) : '');
}

/* ---------- site rendering ---------- */
let contactTab = 'wa'; // which contact form is showing: 'wa' or 'em'

function section(id, title, show, html, adminHint) {
    const sec = $('#' + id), inn = $('#' + id + '-in'), admin = isAdmin();
    sec.hidden = !(show || admin);
    inn.innerHTML = (show ? `<h2 class="reveal">${esc(title)}</h2>${html}` : (admin ? `<h2>${esc(title)}</h2><div class="empty">${esc(adminHint)}</div>` : ''));
}

function renderSite(opts = {}) {
    const d = data, p = d.profile;
    const wa = waNumber(p.whatsapp), canMail = has(p.email);
    document.title = [p.name, p.title].filter(has).join(' - ') || 'Portfolio';
    $('#logo').textContent = p.name || 'Portfolio';

    /* hero */
    const initials = (p.name || '?').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const socialBtns = d.socials.filter(s => has(s.label) && url(s.url)).map(s => btn(s.label, url(s.url))).join('');
    $('#home-in').innerHTML = `
    <div>
      ${has(p.name) ? `<p class="hello h-anim">Hi, I'm</p><h1 class="h-anim">${esc(p.name)}</h1>` : ''}
      ${has(p.title) ? `<p class="role h-anim"><span id="typed">${esc(p.title)}</span><span class="cur"></span></p>` : ''}
      ${has(p.tagline) ? `<p class="tagline h-anim">${esc(p.tagline)}</p>` : ''}
      <div class="actions h-anim">
        ${d.projects.length ? btn('View my work', '#projects', 'solid') : ''}
        ${(canMail || wa) ? btn('Contact me', '#contact') : ''}
        ${btn('Resume', url(p.resume))}
        ${socialBtns}
      </div>
    </div>
    <div class="hero-photo h-anim"><div class="ring"></div><div class="ring r2"></div>
      <div class="pframe">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}">` : `<span>${esc(initials)}</span>`}</div></div>`;

    /* about */
    const meta = [p.location, p.availability].filter(has).map(t => `<span class="pill">${esc(t)}</span>`).join('');
    const stats = d.stats.filter(s => has(s.value) || has(s.label)).map(s => cell(card(`<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`))).join('');
    section('about', 'About', has(p.about) || stats || meta,
        `<div class="about"><div class="reveal"><p class="txt">${esc(p.about)}</p>${meta ? `<div class="meta">${meta}</div>` : ''}</div>${stats ? `<div class="stats">${stats}</div>` : ''}</div>`,
        'Admin panel > Profile: write your About text.');

    /* skills grouped */
    const groups = {};
    d.skills.filter(s => has(s.name)).forEach(s => (groups[s.category?.trim() || 'Skills'] ??= []).push(s));
    section('skills', 'Skills', Object.keys(groups).length,
        `<div class="grid">${Object.entries(groups).map(([g, list]) => cell(card(`<h3>${esc(g)}</h3>${list.map(s => {
            const lv = has(s.level) ? Math.max(0, Math.min(100, +s.level)) : null;
            return `<div class="sk"><div><span>${esc(s.name)}</span>${lv !== null ? `<em>${lv}%</em>` : ''}</div>${lv !== null ? `<div class="bar"><i style="--w:${lv}%"></i></div>` : ''}</div>`;
        }).join('')}`))).join('')}</div>`, 'Admin panel > Skills: add your first skill.');

    /* services */
    section('services', 'Services', d.services.some(s => has(s.title)),
        `<div class="grid">${d.services.filter(s => has(s.title)).map(s => cell(card(`${has(s.icon) ? `<div class="ico">${esc(s.icon)}</div>` : ''}<h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>`))).join('')}</div>`,
        'Admin panel > Services: add what you offer.');

    /* projects */
    section('projects', 'Projects', d.projects.some(s => has(s.title)),
        `<div class="grid">${d.projects.filter(s => has(s.title)).map(s => cell(card(`
      ${s.image ? `<div class="pimg"><img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy"></div>` : ''}
      <h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>
      ${has(s.tech) ? `<div class="tags">${s.tech.split(',').filter(t => t.trim()).map(t => `<span>${esc(t.trim())}</span>`).join('')}</div>` : ''}
      <div class="row">${btn('Live demo', url(s.live), 'solid sm')}${btn('Code', url(s.repo), 'sm')}</div>`))).join('')}</div>`,
        'Admin panel > Projects: add a project and its card appears here.');

    /* experience */
    section('experience', 'Experience', d.experience.some(s => has(s.role) || has(s.org)),
        `<div class="tl">${d.experience.filter(s => has(s.role) || has(s.org)).map(s => cell(card(`
      ${has(s.period) ? `<div class="period">${esc(s.period)}</div>` : ''}<h3>${esc(s.role)}</h3>${has(s.org) ? `<div class="org">${esc(s.org)}</div>` : ''}<p>${esc(s.description)}</p>`))).join('')}</div>`,
        'Admin panel > Experience: add a role.');

    /* learning */
    const label = { completed: 'Completed', learning: 'Learning now', pending: 'Not started yet' };
    section('learning', 'Learning progress', d.learning.some(s => has(s.topic)),
        `<div class="grid">${d.learning.filter(s => has(s.topic)).map(s => {
            const st = label[s.status] ? s.status : 'pending';
            const pr = has(s.progress) ? Math.max(0, Math.min(100, +s.progress)) : null;
            const bar = pr !== null ? `<div class="bar"><i style="--w:${pr}%"></i></div>` : (st === 'learning' ? `<div class="bar live"><i></i></div>` : '');
            return cell(card(`<span class="chip ${st}">${label[st]}</span><h3>${esc(s.topic)}</h3>${has(s.note) ? `<p>${esc(s.note)}</p>` : ''}${bar}`));
        }).join('')}</div>`, 'Admin panel > Learning: add what you are learning.');

    /* contact: two buttons (WhatsApp / Email), one form shown at a time */
    const canForm = canMail || wa;
    const sl = d.socials.filter(s => has(s.label) && url(s.url));
    const tab = (contactTab === 'em' && canMail) ? 'em' : (wa ? 'wa' : 'em');
    const waPane = wa ? `<div data-pane="wa" ${tab === 'wa' ? '' : 'hidden'}>${card(`<h3>Message me on WhatsApp</h3><form class="cf" id="cf-wa"><input name="name" placeholder="Your name" required><textarea name="message" rows="5" placeholder="Your message" required></textarea><input name="_honey" tabindex="-1" autocomplete="off" style="display:none"><button class="btn solid" type="submit">Send on WhatsApp</button></form>`)}</div>` : '';
    const emPane = canMail ? `<div data-pane="em" ${tab === 'em' ? '' : 'hidden'}>${card(`<h3>Send me an email</h3><form class="cf" id="cf-em"><input name="name" placeholder="Your name" required><input name="email" type="email" placeholder="Your email" required><textarea name="message" rows="4" placeholder="Your message" required></textarea><input name="_honey" tabindex="-1" autocomplete="off" style="display:none"><button class="btn solid" type="submit">Send email</button></form>`)}</div>` : '';
    section('contact', 'Contact', canForm || sl.length,
        `<div class="contact">
      <div class="info reveal">
        <div class="row" style="margin-top:0">
          ${wa ? `<button type="button" class="btn ${tab === 'wa' ? 'solid' : ''}" data-form="wa">WhatsApp</button>` : ''}
          ${canMail ? `<button type="button" class="btn ${tab === 'em' ? 'solid' : ''}" data-form="em">Email</button>` : ''}
        </div>
        ${has(p.location) ? `<span class="pill">${esc(p.location)}</span>` : ''}
        ${canMail ? `<span class="pill">${esc(p.email)}</span>` : ''}
        <div class="row">${sl.map(s => btn(s.label, url(s.url), 'sm')).join('')}</div>
      </div>
      ${canForm ? `<div class="reveal">${waPane}${emPane}</div>` : ''}
    </div>`, 'Admin panel > Profile: add your WhatsApp number and email so the contact forms appear.');

    $('#foot-in').textContent = has(p.name) ? `© ${new Date().getFullYear()} ${p.name}` : '';
    buildNav();
    if (!opts.quiet) animateIn(); else if (window.ScrollTrigger) ScrollTrigger.refresh();
    $('#fab').hidden = !isAdmin();
}

function buildNav() {
    const names = { about: 'About', skills: 'Skills', services: 'Services', projects: 'Projects', experience: 'Experience', learning: 'Learning', contact: 'Contact' };
    $('#navlinks').innerHTML = Object.entries(names).filter(([id]) => !$('#' + id).hidden).map(([id, n]) => `<a href="#${id}">${n}</a>`).join('');
}

/* switch between the WhatsApp and Email forms */
document.addEventListener('click', e => {
    const t = e.target.closest('[data-form]'); if (!t) return;
    contactTab = t.dataset.form;
    $$('[data-form]').forEach(b => b.classList.toggle('solid', b.dataset.form === contactTab));
    $$('[data-pane]').forEach(p => {
        const on = p.dataset.pane === contactTab;
        p.hidden = !on;
        if (on && window.gsap && !reduced) gsap.fromTo(p, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
    });
});

/* ---------- animation ---------- */
let introDone = false;
function animateIn() {
    if (!window.gsap || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    if (ScrollTrigger.clearScrollMemory) ScrollTrigger.clearScrollMemory();
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (!introDone) { introDone = true; gsap.from('.h-anim', { y: 46, opacity: 0, duration: 1, stagger: .14, ease: 'power3.out', delay: .1 }); }
    $$('.sec:not([hidden]):not(.hero)').forEach(sec => {
        const items = $$('.reveal', sec); if (!items.length) return;
        gsap.set(items, { opacity: 0, y: 54 });
        ScrollTrigger.batch(items, {
            start: 'top 90%', once: true,
            onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .12, ease: 'power3.out', overwrite: true })
        });
    });
    ScrollTrigger.refresh();
}

/* tilt cards, magnetic buttons, cursor glow (event delegation: survives re-render) */
document.addEventListener('mousemove', e => {
    const g = $('#glow'); g.style.opacity = 1; g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px';
    if (reduced) return;
    const c = e.target.closest?.('.tilt');
    $$('.tilt').forEach(t => { if (t !== c) t.style.transform = ''; });
    if (c) {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 9}deg) rotateY(${(x - .5) * 11}deg) translateZ(8px)`;
        c.style.setProperty('--px', x * 100 + '%'); c.style.setProperty('--py', y * 100 + '%');
    }
    const b = e.target.closest?.('.btn');
    $$('.btn').forEach(x => { if (x !== b) { x.style.setProperty('--mx', '0px'); x.style.setProperty('--my', '0px'); } });
    if (b) { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * .22 + 'px'); b.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * .35 + 'px'); }
});
document.addEventListener('mouseleave', () => { $('#glow').style.opacity = 0; });

/* nav behaviour */
$('#burger').onclick = () => $('#nav').classList.toggle('open');
$('#navlinks').addEventListener('click', () => $('#nav').classList.remove('open'));
addEventListener('scroll', () => {
    let cur = '';
    $$('.sec:not([hidden])').forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    $$('#navlinks a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}, { passive: true });

/* contact forms: #cf-wa opens WhatsApp, #cf-em sends an email to you (FormSubmit) */
document.addEventListener('submit', async e => {
    const id = e.target.id;
    if (id !== 'cf-wa' && id !== 'cf-em') return;
    e.preventDefault();
    const f = e.target, b = $('button', f), fd = Object.fromEntries(new FormData(f));
    if (fd._honey) return;

    /* WhatsApp form */
    if (id === 'cf-wa') {
        const wa = waNumber(data.profile.whatsapp);
        if (!wa) return toast('WhatsApp number is not set.');
        window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent('Hi, I am ' + fd.name + '.\n\n' + fd.message), '_blank');
        f.reset(); toast('Opening WhatsApp. Press send there to deliver your message.');
        return;
    }

    /* Email form */
    const to = data.profile.email.trim();
    const old = b.textContent;
    b.disabled = true; b.textContent = 'Sending...';
    const ctrl = new AbortController(), tm = setTimeout(() => ctrl.abort(), 12000);
    try {
        const r = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
            method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ name: fd.name, email: fd.email, message: fd.message, _subject: 'Portfolio message from ' + fd.name, _replyto: fd.email, _template: 'table', _captcha: 'false' })
        });
        let j = {}; try { j = await r.json(); } catch (x) { }
        if (!r.ok || String(j.success) === 'false') throw 0;
        f.reset(); toast('Email sent. Thank you!');
    } catch (err) {
        toast('Could not send directly. Opening Gmail instead.');
        window.open(gmailLink(to, 'Portfolio message from ' + fd.name, fd.message + '\n\nFrom: ' + fd.name + ' (' + fd.email + ')'), '_blank');
    }
    clearTimeout(tm);
    b.disabled = false; b.textContent = old;
});

/* ---------- 3D background (Three.js) ---------- */
function initScene() {
    if (!window.THREE || reduced) return;
    const canvas = $('#bg'), R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    const S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(60, 1, .1, 100); cam.position.z = 7;
    const N = 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), a = new THREE.Color('#8b5cf6'), b = new THREE.Color('#2f9bff');
    for (let i = 0; i < N; i++) {
        pos.set([(Math.random() - .5) * 24, (Math.random() - .5) * 24, (Math.random() - .5) * 16], i * 3);
        const c = a.clone().lerp(b, Math.random()); col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: .045, vertexColors: true, transparent: true, opacity: .85 })); S.add(pts);
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: .33 })); ico.position.set(3.6, .4, -1.5); S.add(ico);
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(.8, .22, 120, 16), new THREE.MeshBasicMaterial({ color: 0x2f9bff, wireframe: true, transparent: true, opacity: .28 })); knot.position.set(-4.2, -1.8, -2.5); S.add(knot);
    let mx = 0, my = 0, run = true;
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) loop(); });
    function size() { R.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
    addEventListener('resize', size); size();
    function loop() {
        if (!run) return; requestAnimationFrame(loop);
        const sy = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
        pts.rotation.y += .0006; pts.rotation.x = sy * .8;
        ico.rotation.x += .004; ico.rotation.y += .006; knot.rotation.x -= .005; knot.rotation.y += .004;
        cam.position.x += (mx * 1.2 - cam.position.x) * .04; cam.position.y += (-my * .9 - cam.position.y) * .04; cam.position.y -= sy * .01;
        cam.lookAt(0, 0, 0); R.render(S, cam);
    }
    loop();
}

/* ============ ADMIN PANEL ============ */
const panel = $('#panel');
const A = { tab: 'profile', open: -1, unlocked: false };

async function hashPw(s) {
    if (window.crypto?.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('pf:' + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
    let h = 5381; for (const ch of 'pf:' + s) h = (h * 33) ^ ch.charCodeAt(0); return 'x' + (h >>> 0);
}
function openPanel() { panel.classList.add('open'); drawPanel(); }
function closePanel() { panel.classList.remove('open'); sessionStorage.removeItem(SESSION); renderSite({ quiet: true }); }

function drawPanel() {
    if (!isAdmin()) return drawLock();
    const tabs = [...Object.keys(SCHEMA), 'settings'];
    panel.innerHTML = `<div class="ph"><span>Edit your portfolio</span><button class="px" data-act="close" aria-label="Close">×</button></div>
    <div class="tabs">${tabs.map(t => `<button data-act="tab" data-t="${t}" class="${A.tab === t ? 'on' : ''}">${t === 'settings' ? 'Backup & publish' : SCHEMA[t].label}</button>`).join('')}</div>
    <div class="pb" id="pb">${A.tab === 'settings' ? settingsHTML() : A.tab === 'profile' ? formHTML(SCHEMA.profile.fields, data.profile, '') : listHTML(A.tab)}</div>`;
}
function drawLock() {
    const first = !localStorage.getItem(PWKEY);
    panel.innerHTML = `<div class="ph"><span>${first ? 'Create admin password' : 'Admin login'}</span><button class="px" data-act="close" aria-label="Close">×</button></div>
    <div class="pb"><p class="hint">${first ? 'Choose a password. It is stored only in this browser.' : 'Enter your password to edit the site.'}</p>
    <label class="fld"><span>Password</span><input type="password" id="pw" autocomplete="current-password"></label>
    <button class="abtn main" data-act="unlock">${first ? 'Save password & open' : 'Unlock'}</button></div>`;
    setTimeout(() => $('#pw')?.focus(), 400);
}

function fieldHTML(f, val, attrs) {
    const t = f.t || 'text';
    if (t === 'textarea') return `<label class="fld"><span>${f.l}</span><textarea rows="4" ${attrs}>${esc(val)}</textarea></label>`;
    if (t === 'select') return `<label class="fld"><span>${f.l}</span><select ${attrs}>${f.opts.map(([v, n]) => `<option value="${v}" ${val === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
    if (t === 'image') return `<div class="fld"><span>${f.l}</span><div class="imgfld">${val ? `<img src="${esc(val)}" alt="">` : ''}<label class="abtn">Choose image<input type="file" accept="image/*" hidden ${attrs} data-max="${f.max || 900}"></label>${val ? `<button class="abtn" data-act="clearimg" ${attrs}>Remove</button>` : ''}</div></div>`;
    return `<label class="fld"><span>${f.l}</span><input type="${t === 'number' ? 'number' : t === 'email' ? 'email' : 'text'}" value="${esc(val)}" ${attrs}></label>`;
}
const formHTML = (fields, obj, idx) => fields.map(f => fieldHTML(f, obj[f.k] ?? '', `data-k="${f.k}" ${idx !== '' ? `data-i="${idx}"` : ''}`)).join('');
function listHTML(t) {
    const S = SCHEMA[t], list = data[t];
    return `${list.map((it, i) => `<div class="item"><div class="ih" data-act="toggle" data-i="${i}"><b>${esc(it[S.title] || 'Untitled')}</b>
      <button class="ib" data-act="up" data-i="${i}" title="Move up">↑</button><button class="ib" data-act="down" data-i="${i}" title="Move down">↓</button><button class="ib del" data-act="del" data-i="${i}" title="Delete">✕</button></div>
      ${A.open === i ? `<div class="ibody">${formHTML(S.fields, it, i)}</div>` : ''}</div>`).join('')}
    <button class="abtn main" data-act="add">+ Add ${S.label.toLowerCase().replace(/s$/, '')}</button>
    ${list.length ? '' : '<p class="hint">Nothing here yet. Add your first one and its card appears on the site.</p>'}`;
}
function settingsHTML() {
    return `<p class="hint">Your edits are saved in this browser automatically. To make them visible to everyone, click <b>Publish</b>, then replace script.js on your hosting with the downloaded file.</p>
    <button class="abtn main" data-act="publish">Publish: download updated script.js</button>
    <button class="abtn" data-act="export">Download backup (.json)</button>
    <label class="abtn">Restore backup<input type="file" accept=".json,application/json" hidden id="imp"></label>
    <button class="abtn" data-act="reset">Discard my edits (go back to published version)</button>
    <label class="fld"><span>Change password</span><input type="password" id="npw" placeholder="New password"></label>
    <button class="abtn" data-act="setpw">Save new password</button>
    <button class="abtn" data-act="lock">Lock admin</button>`;
}

function target(el) {
    const i = el.dataset.i; return A.tab === 'profile' ? data.profile : data[A.tab][+i];
}
let rt; const liveRender = () => { clearTimeout(rt); rt = setTimeout(() => renderSite({ quiet: true }), 160); };

panel.addEventListener('input', e => {
    const el = e.target; if (!el.dataset.k || el.type === 'file') return;
    target(el)[el.dataset.k] = el.value; save(); liveRender();
    const b = $(`.item:nth-child(${(+el.dataset.i || 0) + 1}) .ih b`, panel); if (b && SCHEMA[A.tab]?.title === el.dataset.k) b.textContent = el.value || 'Untitled';
});
panel.addEventListener('change', async e => {
    const el = e.target;
    if (el.id === 'imp') { const f = el.files[0]; if (!f) return; try { data = merge(DEFAULTS, JSON.parse(await f.text())); save(); renderSite(); drawPanel(); toast('Backup restored.'); } catch (x) { toast('That file is not a valid backup.'); } return; }
    if (el.type === 'file' && el.dataset.k && el.files[0]) {
        const max = +el.dataset.max || 900, f = el.files[0], im = new Image(), fr = new FileReader();
        fr.onload = () => {
            im.onload = () => {
                const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s;
                c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
                target(el)[el.dataset.k] = c.toDataURL('image/jpeg', .84); save(); renderSite({ quiet: true }); drawPanel(); toast('Image added.');
            };
            im.src = fr.result;
        };
        fr.readAsDataURL(f);
    }
});
panel.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act, i = +b.dataset.i, list = data[A.tab];
    if (act !== 'toggle') e.stopPropagation();
    if (e.target.closest('.ib') && act === 'toggle') return;
    switch (act) {
        case 'close': closePanel(); break;
        case 'tab': A.tab = b.dataset.t; A.open = -1; drawPanel(); break;
        case 'toggle': A.open = A.open === i ? -1 : i; drawPanel(); break;
        case 'add': list.push({}); A.open = list.length - 1; save(); renderSite({ quiet: true }); drawPanel(); break;
        case 'del': if (confirm('Delete this item?')) { list.splice(i, 1); A.open = -1; save(); renderSite({ quiet: true }); drawPanel(); } break;
        case 'up': if (i > 0) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; A.open = -1; save(); renderSite({ quiet: true }); drawPanel(); } break;
        case 'down': if (i < list.length - 1) { [list[i + 1], list[i]] = [list[i], list[i + 1]]; A.open = -1; save(); renderSite({ quiet: true }); drawPanel(); } break;
        case 'clearimg': target(b)[b.dataset.k] = ''; save(); renderSite({ quiet: true }); drawPanel(); break;
        case 'unlock': {
            const v = $('#pw').value; if (!v) return toast('Enter a password.');
            const h = await hashPw(v), s = localStorage.getItem(PWKEY);
            if (!s) localStorage.setItem(PWKEY, h); else if (s !== h) return toast('Wrong password.');
            sessionStorage.setItem(SESSION, '1'); renderSite({ quiet: true }); drawPanel(); break;
        }
        case 'setpw': { const v = $('#npw').value; if (!v) return toast('Type a new password first.'); localStorage.setItem(PWKEY, await hashPw(v)); $('#npw').value = ''; toast('Password updated.'); break; }
        case 'lock': closePanel(); break;
        case 'export': download('portfolio-backup.json', JSON.stringify(data, null, 2), 'application/json'); break;
        case 'reset': if (confirm('Remove all edits made in this browser?')) { localStorage.removeItem(KEY); data = load(); renderSite(); drawPanel(); toast('Back to published version.'); } break;
        case 'publish': publish(); break;
    }
});

function download(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.append(a); a.click(); a.remove();
}
async function publish() {
    let src;
    try { const r = await fetch('script.js', { cache: 'no-store' }); if (!r.ok) throw 0; src = await r.text(); }
    catch (e) { return toast('Publish works when the site is opened from a host or local server. For now use "Download backup".'); }
    const json = JSON.stringify(data);
    const out = src.replace(/const BAKED_DATA = [\s\S]*?; \/\/ @@BAKED@@/, () => 'const BAKED_DATA = ' + json + '; // @@BAKED@@');
    download('script.js', out, 'text/javascript'); toast('Upload this script.js to your hosting to go live.');
}

/* open admin: Ctrl+Shift+A, #admin in the address, or click the logo 5 times */
addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') { e.preventDefault(); openPanel(); } });
let clicks = 0, ct;
$('#logo').addEventListener('click', () => { clicks++; clearTimeout(ct); ct = setTimeout(() => clicks = 0, 1500); if (clicks >= 5) { clicks = 0; openPanel(); } });
$('#fab').onclick = openPanel;
addEventListener('hashchange', () => { if (location.hash === '#admin') { openPanel(); history.replaceState(null, '', location.pathname); } });

/* ---------- start ---------- */
renderSite();
initScene();
if (location.hash === '#admin') { openPanel(); history.replaceState(null, '', location.pathname); }

/* navbar: top par chhupa, jab tum khud scroll karo tab aaye */
const navEl = $('#nav');
let userScrolled = false;
['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(ev => addEventListener(ev, () => { userScrolled = true; }, { passive: true, once: true }));
function updateNav() {
    const show = (userScrolled && scrollY > 80) || navEl.classList.contains('open');
    navEl.classList.toggle('hide', !show);
}
addEventListener('scroll', updateNav, { passive: true });
updateNav();
