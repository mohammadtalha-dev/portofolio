const BAKED_DATA = null;
const KEY = 'pf_data_v1', PWKEY = 'pf_pw_v1', SESSION = 'pf_admin_open';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.documentElement.style.scrollBehavior = 'auto';
const toTop = () => { if (!location.hash) window.scrollTo(0, 0); };
toTop();
addEventListener('DOMContentLoaded', toTop);
addEventListener('load', () => {
    toTop(); setTimeout(toTop, 100); setTimeout(toTop, 400);
    setTimeout(() => { toTop(); document.documentElement.style.scrollBehavior = ''; }, 1000);
});
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
    catch (e) { toast('Storage full - use smaller images.'); }
}
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
let contactTab = 'wa'; 
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
    const meta = [p.location, p.availability].filter(has).map(t => `<span class="pill">${esc(t)}</span>`).join('');
    const stats = d.stats.filter(s => has(s.value) || has(s.label)).map(s => cell(card(`<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`))).join('');
    section('about', 'About', has(p.about) || stats || meta,
        `<div class="about"><div class="reveal"><p class="txt">${esc(p.about)}</p>${meta ? `<div class="meta">${meta}</div>` : ''}</div>${stats ? `<div class="stats">${stats}</div>` : ''}</div>`,
        'Admin panel > Profile: write your About text.');
    const groups = {};
    d.skills.filter(s => has(s.name)).forEach(s => (groups[s.category?.trim() || 'Skills'] ??= []).push(s));
    section('skills', 'Skills', Object.keys(groups).length,
        `<div class="grid">${Object.entries(groups).map(([g, list]) => cell(card(`<h3>${esc(g)}</h3>${list.map(s => {
            const lv = has(s.level) ? Math.max(0, Math.min(100, +s.level)) : null;
            return `<div class="sk"><div><span>${esc(s.name)}</span>${lv !== null ? `<em>${lv}%</em>` : ''}</div>${lv !== null ? `<div class="bar"><i style="--w:${lv}%"></i></div>` : ''}</div>`;
        }).join('')}`))).join('')}</div>`, 'Admin panel > Skills: add your first skill.');
    section('services', 'Services', d.services.some(s => has(s.title)),
        `<div class="grid">${d.services.filter(s => has(s.title)).map(s => cell(card(`${has(s.icon) ? `<div class="ico">${esc(s.icon)}</div>` : ''}<h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>`))).join('')}</div>`,
        'Admin panel > Services: add what you offer.');
    section('projects', 'Projects', d.projects.some(s => has(s.title)),
        `<div class="grid">${d.projects.filter(s => has(s.title)).map(s => cell(card(`
      ${s.image ? `<div class="pimg"><img src="${esc(s.image)}" alt="${esc(s.title)}" loading="lazy"></div>` : ''}
      <h3>${esc(s.title)}</h3><p>${esc(s.description)}</p>
      ${has(s.tech) ? `<div class="tags">${s.tech.split(',').filter(t => t.trim()).map(t => `<span>${esc(t.trim())}</span>`).join('')}</div>` : ''}
      <div class="row">${btn('Live demo', url(s.live), 'solid sm')}${btn('Code', url(s.repo), 'sm')}</div>`))).join('')}</div>`,
        'Admin panel > Projects: add a project and its card appears here.');
    section('experience', 'Experience', d.experience.some(s => has(s.role) || has(s.org)),
        `<div class="tl">${d.experience.filter(s => has(s.role) || has(s.org)).map(s => cell(card(`
      ${has(s.period) ? `<div class="period">${esc(s.period)}</div>` : ''}<h3>${esc(s.role)}</h3>${has(s.org) ? `<div class="org">${esc(s.org)}</div>` : ''}<p>${esc(s.description)}</p>`))).join('')}</div>`,
        'Admin panel > Experience: add a role.');
    const label = { completed: 'Completed', learning: 'Learning now', pending: 'Not started yet' };
    section('learning', 'Learning progress', d.learning.some(s => has(s.topic)),
        `<div class="grid">${d.learning.filter(s => has(s.topic)).map(s => {
            const st = label[s.status] ? s.status : 'pending';
            const pr = has(s.progress) ? Math.max(0, Math.min(100, +s.progress)) : null;
            const bar = pr !== null ? `<div class="bar"><i style="--w:${pr}%"></i></div>` : (st === 'learning' ? `<div class="bar live"><i></i></div>` : '');
            return cell(card(`<span class="chip ${st}">${label[st]}</span><h3>${esc(s.topic)}</h3>${has(s.note) ? `<p>${esc(s.note)}</p>` : ''}${bar}`));
        }).join('')}</div>`, 'Admin panel > Learning: add what you are learning.');
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
$('#burger').onclick = () => $('#nav').classList.toggle('open');
$('#navlinks').addEventListener('click', () => $('#nav').classList.remove('open'));
addEventListener('scroll', () => {
    let cur = '';
    $$('.sec:not([hidden])').forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    $$('#navlinks a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}, { passive: true });
document.addEventListener('submit', async e => {
    const id = e.target.id;
    if (id !== 'cf-wa' && id !== 'cf-em') return;
    e.preventDefault();
    const f = e.target, b = $('button', f), fd = Object.fromEntries(new FormData(f));
    if (fd._honey) return;
    if (id === 'cf-wa') {
        const wa = waNumber(data.profile.whatsapp);
        if (!wa) return toast('WhatsApp number is not set.');
        window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent('Hi, I am ' + fd.name + '.\n\n' + fd.message), '_blank');
        f.reset(); toast('Opening WhatsApp. Press send there to deliver your message.');
        return;
    }
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
function initScene() {
    if (!window.THREE || reduced) return;
    const canvas = $('#bg'), R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    const S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(60, 1, .1, 100); cam.position.z = 7;
    const N = innerWidth < 700 ? 600 : 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), a = new THREE.Color('#8b5cf6'), b = new THREE.Color('#2f9bff');
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
    <div class="tabs">${tabs.map(t => `<button data-act="tab" data-t="${t}" class="${A.tab === t ? 'on' : ''}">${t === 'settings' ? 'Password' : SCHEMA[t].label}</button>`).join('')}</div>
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
    return `<label class="fld"><span>Change password</span><input type="password" id="npw" placeholder="New password"></label>
    <button class="abtn main" data-act="setpw">Save new password</button>
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
panel.addEventListener('change', e => {
    const el = e.target;
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
    }
});
function download(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.append(a); a.click(); a.remove();
}
async function publish() {
    let src;
    try { const r = await fetch('script.js', { cache: 'no-store' }); if (!r.ok) throw 0; src = await r.text(); }
    catch (e) { return toast('Publish works when the site is opened from a host or local server (Live Server).'); }
    const json = JSON.stringify(data);
    const out = src.replace(/const BAKED_DATA = [\s\S]*?; \/\/ @@BAKED@@/, () => 'const BAKED_DATA = ' + json + '; // @@BAKED@@');
    download('script.js', out, 'text/javascript'); toast('Upload this script.js to your hosting to go live.');
}
addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u' && isAdmin()) { e.preventDefault(); publish(); }
});
addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openPanel();
    }
});
let logoClicks = 0;
let logoClickTimer = null;
const logoElement = $('#logo');
if (logoElement) {
    logoElement.style.cursor = 'pointer';
    logoElement.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        logoClicks++;
        clearTimeout(logoClickTimer);
        if (logoClicks >= 5) {
            logoClicks = 0;
            clearTimeout(logoClickTimer);
            openPanel();
            return;
        }
        logoClickTimer = setTimeout(() => {
            logoClicks = 0;
        }, 3000);
    });
}
$('#fab').onclick = openPanel;
addEventListener('hashchange', () => {
    if (location.hash === '#admin') {
        openPanel();
        history.replaceState(null, '', location.pathname);
    }
});
renderSite();
initScene();
if (location.hash === '#admin') { openPanel(); history.replaceState(null, '', location.pathname); }
const navEl = $('#nav');
let userScrolled = false;
['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(ev => addEventListener(ev, () => { userScrolled = true; }, { passive: true, once: true }));
function updateNav() {
    const show = (userScrolled && scrollY > 80) || navEl.classList.contains('open');
    navEl.classList.toggle('hide', !show);
}
addEventListener('scroll', updateNav, { passive: true });
updateNav();
const REVIEW_KEY = 'pf_rated_v1';
const FIRST_REVIEW_DELAY = 1500;
const LATER_REVIEW_DELAY = 3 * 60 * 1000;
(function reviewPopup() {
    try {
        if (localStorage.getItem(REVIEW_KEY)) return;
    } catch (e) {}
    if (isAdmin()) return;
    const labels = [
        '',
        'Poor',
        'Fair',
        'Good',
        'Very good',
        'Excellent'
    ];
    const star = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    `;
    const css = document.createElement('style');
    css.textContent = `
        .rv {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(5,4,11,.82);
            backdrop-filter: blur(9px);
            -webkit-backdrop-filter: blur(9px);
        }
        .rv-card {
            width: min(420px,100%);
            text-align: center;
            padding: 34px 26px 28px;
            border-radius: 24px;
            background: #120d24;
            border: 1px solid rgba(139,92,246,.6);
            box-shadow: 0 30px 90px rgba(139,92,246,.35);
        }
        .rv-card h3 {
            font-family: var(--display);
            font-size: 1.5rem;
            margin-bottom: 8px;
            color: white;
        }
        .rv-card p {
            color: var(--muted);
            font-size: .95rem;
        }
        .rv-stars {
            display: flex;
            justify-content: center;
            gap: 6px;
            margin: 24px 0 10px;
        }
        .rv-star {
            background: none;
            border: 0;
            padding: 4px;
            cursor: pointer;
            width: 54px;
            height: 54px;
            color: rgba(255,255,255,.2);
            transition: .2s;
        }
        .rv-star svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
        }
        .rv-star.on {
            color: #fbbf24;
            filter: drop-shadow(0 0 10px rgba(251,191,36,.7));
        }
        .rv-star:hover {
            transform: scale(1.15);
        }
        .rv-label {
            min-height: 1.5em;
            color: #fbbf24 !important;
            font-weight: 700;
        }
        .rv-later {
            margin-top: 16px;
            padding: 8px 20px;
            background: transparent;
            border: 0;
            color: var(--muted);
            cursor: pointer;
            font: 600 .9rem var(--body);
            text-decoration: underline;
        }
        .rate-us {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9998;
            padding: 12px 21px;
            border: 0;
            border-radius: 999px;
            background: var(--grad);
            color: white;
            font: 700 .9rem var(--body);
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(139,92,246,.4);
        }
        .rate-us:hover {
            transform: translateY(-3px);
        }
        @media(max-width:420px) {
            .rv-star {
                width: 46px;
                height: 46px;
            }
            .rate-us {
                right: 14px;
                bottom: 14px;
            }
        }
    `;
    document.head.appendChild(css);
    let box = null;
    let selectedRating = 0;
    let submitting = false;
    let popupTimer = null;
    const rateButton = document.createElement('button');
    rateButton.type = 'button';
    rateButton.className = 'rate-us';
    rateButton.textContent = '★ Rate Us';
    document.body.appendChild(rateButton);
    function closePopup() {
        if (!box) return;
        const oldBox = box;
        box = null;
        document.body.style.overflow = '';
        oldBox.remove();
    }
    function schedulePopup(delay) {
        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => {
            let alreadyRated = false;
            try {
                alreadyRated = !!localStorage.getItem(REVIEW_KEY);
            } catch (e) {}
            if (!alreadyRated && !isAdmin()) {
                showPopup();
            }
        }, delay);
    }
    function paint(n) {
        if (!box) return;
        $$('.rv-star', box).forEach((s, i) => {
            s.classList.toggle('on', i < n);
        });
        const label = $('#rv-label', box);
        if (label) {
            label.textContent = labels[n] || 'Select your rating';
        }
    }
    async function sendRating(n) {
        const to = (data.profile.email || '').trim();
        if (!to) return false;
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 12000);
        try {
            const response = await fetch(
                'https://formsubmit.co/ajax/' + encodeURIComponent(to),
                {
                    method: 'POST',
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify({
                        rating: n + ' / 5',
                        message:
                            'A visitor rated your portfolio ' +
                            n + ' out of 5 stars.',
                        _subject:
                            'Portfolio rating: ' + n + ' stars',
                        _template: 'table',
                        _captcha: 'false'
                    })
                }
            );
            let result = {};
            try {
                result = await response.json();
            } catch (e) {}
            return response.ok &&
                String(result.success) !== 'false';
        } catch (e) {
            return false;
        } finally {
            clearTimeout(timeout);
        }
    }
    function showPopup() {
        if (box) return;
        try {
            if (localStorage.getItem(REVIEW_KEY)) return;
        } catch (e) {}
        clearTimeout(popupTimer);
        selectedRating = 0;
        submitting = false;
        box = document.createElement('div');
        box.className = 'rv';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.innerHTML = `
            <div class="rv-card">
                <h3>Rate my portfolio</h3>
                <p>
                    Your feedback helps me improve my work.
                </p>
                <div class="rv-stars">
                    ${[1,2,3,4,5].map(n => `
                        <button
                            type="button"
                            class="rv-star"
                            data-n="${n}"
                            aria-label="${n} stars">
                            ${star}
                        </button>
                    `).join('')}
                </div>
                <p class="rv-label" id="rv-label">
                    Select your rating
                </p>
                <button
                    type="button"
                    class="rv-later"
                    id="rv-later">
                    Later
                </button>
            </div>
        `;
        document.body.appendChild(box);
        document.body.style.overflow = 'hidden';
        const stars = $('.rv-stars', box);
        stars.addEventListener('mouseover', e => {
            const s = e.target.closest('.rv-star');
            if (s && !submitting) {
                paint(+s.dataset.n);
            }
        });
        stars.addEventListener('mouseleave', () => {
            if (!submitting) {
                paint(selectedRating);
            }
        });
        stars.addEventListener('click', async e => {
            const s = e.target.closest('.rv-star');
            if (!s || submitting) return;
            selectedRating = +s.dataset.n;
            submitting = true;
            paint(selectedRating);
            $('#rv-label', box).textContent =
                'Submitting your rating...';
            const success = await sendRating(selectedRating);
            if (success) {
                try {
                    localStorage.setItem(
                        REVIEW_KEY,
                        String(selectedRating)
                    );
                } catch (e) {}
                $('#rv-label', box).textContent =
                    'Thank you! ' + labels[selectedRating];
                rateButton.remove();
                setTimeout(closePopup, 1200);
            } else {
                submitting = false;
                $('#rv-label', box).textContent =
                    'Could not submit. Please try again.';
            }
        });
        $('#rv-later', box).addEventListener('click', () => {
            closePopup();
            schedulePopup(LATER_REVIEW_DELAY);
        });
    }
    rateButton.addEventListener('click', showPopup);
    schedulePopup(FIRST_REVIEW_DELAY);
})();
