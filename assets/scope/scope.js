/* NR-2028: the oscilloscope. Everything it shows comes from content/*.md (see content.js);
   this file only knows how to draw it. */
window.startScope = function (DATA) {
    'use strict';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var body = document.body;
    var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = RM.matches;
    if (RM.addEventListener) RM.addEventListener('change', function (e) { reduced = e.matches; });
    var store = {
        get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
    };
    // ================= content, read from the markdown in content/ =================
    var S = DATA.site || {}, HOME = DATA.home.meta, EDU = DATA.education.meta, BEY = DATA.beyond.meta, CON = DATA.contact.meta;
    var RESUME = S.resume || '';
    function md(src) { return src ? window.marked.parse(String(src)) : ''; }
    function mdInline(src) { return src == null ? '' : window.marked.parseInline(String(src)); }
    function list(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }
    // "label: value" rows, from a YAML map or a list of one-line maps
    function pairs(x) {
        var out = [];
        list(x).forEach(function (o) {
            if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { out.push([k, o[k] == null ? '' : String(o[k])]); });
        });
        return out;
    }
    function tagLine(t) {
        if (typeof t === 'string') t = t.split(/[\s,]+/);
        return list(t).filter(Boolean).map(function (x) { x = String(x).trim(); return x.charAt(0) === '#' ? x : '#' + x; }).join(' ');
    }
    // links to other sites and to PDFs open in a new tab
    function ext(url) { return /^(https?:)?\/\//i.test(url) || /\.pdf(#|$)/i.test(url) ? ' target="_blank" rel="noopener"' : ''; }
    function fixLinks(root) {
        $$('a[href]', root).forEach(function (a) { if (ext(a.getAttribute('href'))) { a.target = '_blank'; a.rel = 'noopener'; } });
        $$('img', root).forEach(function (im) { im.loading = 'lazy'; });
    }
    function measHTML(rows) {
        return rows.length ? '<div class="meas">' + rows.map(function (m) { return '<div><span class="k">' + esc(m[0]) + '</span><span class="v">' + mdInline(m[1]) + '</span></div>'; }).join('') + '</div>' : '';
    }
    // readouts: [top-left, top-right, bottom-left, bottom-right]
    function ro(v, d) { v = list(v); return [0, 1, 2, 3].map(function (i) { return v[i] != null ? String(v[i]) : d[i]; }); }
    function pad2(n) { return ('0' + n).slice(-2); }

    var PROJECTS = DATA.projects.map(function (f, i) {
        var m = f.meta;
        return {
            id: f.id, n: i, tag: m.tag || '', title: m.title || f.id, cat: m.category || '', wave: m.wave || 'square',
            hint: m.hint || '', img: m.image || '', imgAlt: m.image_alt || m.title || '', text: m.summary || '',
            meas: pairs(m.measurements),
            links: list(m.links).map(function (l) { return [l.label || l.url, l.url]; }),
            video: m.video && m.video.youtube ? [String(m.video.youtube), m.video.title || String(m.title || '').toUpperCase()] : null,
            body: f.body
        };
    });
    var PROJ = {};
    PROJECTS.forEach(function (p) { PROJ[p.id] = p; });

    var MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    function M(y, m) { return y * 12 + m - 1; }
    // "2025-10", "Oct 2025" or "October 2025" -> month number; "present" -> null
    function month(v, where) {
        if (v == null || /^(present|now|current)$/i.test(String(v).trim())) return null;
        if (v instanceof Date) return M(v.getUTCFullYear(), v.getUTCMonth() + 1);
        var t = String(v).trim(), m;
        if ((m = /^(\d{4})-(\d{1,2})/.exec(t))) return M(+m[1], +m[2]);
        if ((m = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i.exec(t)) && MON.indexOf(m[1].toUpperCase()) >= 0) return M(+m[2], MON.indexOf(m[1].toUpperCase()) + 1);
        throw new Error(where + ': can’t read the date "' + t + '" (use YYYY-MM, e.g. 2025-10)');
    }

    // CH2: each experience file is one organization with one or more roles on a trace (timeline row)
    var LANES = list(S.traces).map(String), ROLES = [], ROLE = {}, DOCS = {};
    DATA.experience.forEach(function (f) {
        var m = f.meta, roles = list(m.roles), where = 'content/experiences/' + f.id + '.md';
        DOCS[f.id] = f;
        roles.forEach(function (r, i) {
            var lane = String(r.trace || m.trace || m.org || f.id);
            if (LANES.indexOf(lane) < 0) LANES.push(lane);
            var s0 = month(r.start, where);
            if (s0 == null) throw new Error(where + ': every role needs a start date');
            var end = month(r.end, where);
            ROLES.push({
                id: f.id + (roles.length > 1 ? '/' + (i + 1) : ''), file: f.id, lane: LANES.indexOf(lane),
                s0: s0, endM: end, e: end != null,
                label: String(r.label || r.title || '').toUpperCase(), short: r.short ? String(r.short).toUpperCase() : '',
                t: r.title || '', org: r.org || m.org || '', d: r.summary || '', tags: tagLine(r.tags),
                links: list(r.links || m.links), doc: !!f.body
            });
        });
    });
    ROLES.sort(function (a, b) { return b.s0 - a.s0 || (a.e ? 1 : 0) - (b.e ? 1 : 0); });   // newest first
    var NOWM = (function () { var d = new Date(); return M(d.getFullYear(), d.getMonth() + 1); })();
    ROLES.forEach(function (r) { NOWM = Math.max(NOWM, r.s0, r.e ? r.endM : 0); });
    var AX0 = Math.min.apply(null, ROLES.map(function (r) { return r.s0; }).concat([NOWM])) - 1, AX1 = NOWM + 1;
    ROLES.forEach(function (r, i) {
        r.n = i;
        r.e0 = r.e ? r.endM + 1 : AX1;
        ROLE[r.id] = r;
    });
    function fmtM(m) { return MON[m % 12] + ' ' + Math.floor(m / 12); }
    function startOf(r) { return fmtM(r.s0); }
    function endOf(r) { return r.e ? fmtM(r.e0 - 1) : 'PRESENT'; }
    function dur(n) { var y = Math.floor(n / 12), m = n % 12; return (y ? y + ' yr ' : '') + (m || !y ? m + ' mo' : '').trim(); }

    var CUBING = BEY.cubing || {}, COOKING = BEY.cooking || {};
    var CUBES = list(CUBING.records).map(function (c) { return [String(c.event), String(c.single), String(c.average)]; });

    // ---- the screens that are mostly words ----
    $('#nameplate').textContent = S.nameplate || S.name || '';
    $('#home-name').textContent = S.name || '';
    $('#sig').setAttribute('aria-label', (S.name || '') + ', traced in X-Y mode');
    $('#home-tagline').innerHTML = list(HOME.tagline).map(function (l) { return '<span class="ln">' + mdInline(l) + '</span>'; }).join(' ');
    if (HOME.photo) { $('#home-photo').src = HOME.photo; $('#home-photo').alt = HOME.photo_alt || S.name || ''; }
    else $('#home-photo').parentNode.remove();
    $('#home-bio').innerHTML = md(DATA.home.body);
    $$('[data-print]').forEach(function (a) { a.href = RESUME; });

    $('#s-ch3').innerHTML =
        '<h2>' + esc(EDU.heading || 'CH3 · Education') + '</h2>' +
        '<div class="edu-head"><div class="big">' + mdInline(EDU.school) + '</div><div>' + mdInline(EDU.degree) +
            (EDU.expected ? ' <span class="dim">· ' + mdInline(EDU.expected) + '</span>' : '') + '</div></div>' +
        '<svg class="step" id="step" viewBox="0 0 600 150" aria-hidden="true">' +
            '<line class="band" x1="40" y1="34" x2="600" y2="34"/><line class="band" x1="40" y1="46" x2="600" y2="46"/>' +
            '<path class="in" d="M0 130 H40 V40 H600"/><path class="resp" id="resp" pathLength="1" d=""/>' +
            '<line class="ts" id="ts" x1="0" y1="20" x2="0" y2="140"/></svg>' +
        '<div class="step-cap"><span>STEP INPUT</span><span>SETTLES → <b>' + esc(EDU.settles || '') + '</b></span></div>' +
        measHTML(pairs(EDU.measurements)) +
        (EDU.coursework ? '<h2>' + esc(EDU.coursework_heading || 'Coursework worth mentioning') + '</h2><ul class="courses">' +
            pairs(EDU.coursework).map(function (c) { return '<li><b>' + esc(c[0]) + '</b>' + mdInline(c[1]) + '</li>'; }).join('') + '</ul>' : '') +
        (EDU.skills ? '<h2>' + esc(EDU.skills_heading || 'Skills') + '</h2><div class="skills">' +
            pairs(EDU.skills).map(function (k) { return '<div><span class="k">' + esc(k[0]) + '</span>' + mdInline(k[1]) + '</div>'; }).join('') + '</div>' : '') +
        (DATA.education.body ? '<div class="md">' + md(DATA.education.body) + '</div>' : '');

    function hint(h) { return h ? ' <span class="hint">' + esc(h) + '</span>' : ''; }
    $('#s-ch4').innerHTML =
        (CUBES.length || CUBING.photo ? '<h2>' + esc(CUBING.heading || 'Speedcubing') + hint(CUBING.hint) + '</h2>' : '') +
        (CUBES.length ? '<div class="cursors" id="cursors"></div>' : '') +
        (CUBING.photo || CUBING.videos ? '<div class="nats">' +
            (CUBING.photo ? '<figure class="phos"><img src="' + esc(CUBING.photo) + '" alt="' + esc(CUBING.photo_alt || '') + '" loading="lazy"></figure>' : '') +
            '<div>' + (CUBING.competition ? '<p class="hi" style="margin-bottom:8px">' + mdInline(CUBING.competition) + '</p>' : '') +
            '<div class="vids">' + list(CUBING.videos).map(function (v) {
                var title = [String(v.label || 'Video').toUpperCase(), v.time, String(CUBING.competition || '').toUpperCase()].filter(Boolean).join(' · ');
                return '<button class="soft" type="button" data-video="' + esc(v.youtube) + '" data-title="' + esc(title) + '">▶ ' + esc(v.label || 'Video') + (v.time ? ' <b>' + esc(v.time) + '</b>' : '') + '</button>';
            }).join('') + '</div></div></div>' : '') +
        (list(COOKING.dishes).length ? '<h2>' + esc(COOKING.heading || 'Cooking') + hint(COOKING.hint) + '</h2><div class="dishes">' +
            list(COOKING.dishes).map(function (d) {
                var name = String(d.name || '');
                return '<button class="dish" type="button" aria-expanded="false" data-desc="' + esc(d.description || '') + '"><span class="phos"><img src="' + esc(d.photo || '') +
                    '" alt="' + esc(name.charAt(0).toUpperCase() + name.slice(1)) + '" loading="lazy"></span><span class="nm">' + esc(name) + '</span></button>';
            }).join('') + '</div>' : '') +
        (DATA.beyond.body ? '<div class="md dim">' + md(DATA.beyond.body) + '</div>' : '');

    $('#s-probe').innerHTML =
        '<h2>' + esc(CON.heading || 'Probe out · Say hello') + '</h2>' +
        '<div class="cal"><svg viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true"><path id="calwave" d=""/></svg>' +
            '<div class="lbl">PROBE COMP<br><b>1 kHz · 0.5 Vp-p</b><br>connect probe here ↘</div></div>' +
        (DATA.contact.body ? '<div class="md">' + md(DATA.contact.body) + '</div>' : '') +
        '<ul class="term">' + list(CON.links).map(function (l) {
            var text = String(l.text || l.url || '');
            return '<li><span class="k" data-type="' + esc(l.label || '') + '"></span><a href="' + esc(l.url || '#') + '"' + ext(l.url || '') +
                ' aria-label="' + esc((l.label || '') + ': ' + text) + '"><span data-type="' + esc(text) + '" aria-hidden="true"></span></a></li>';
        }).join('') + '</ul>';
    fixLinks($('#view'));

    // ================= small helpers =================
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    // Waveform icons: y = f(u), u in [0, 1) across the capture
    var WAVES = {
        square: function (u) { return Math.tanh(7 * Math.sin(2 * Math.PI * 2.5 * u)) / Math.tanh(7); },
        complex: function (u) { var w = 2 * Math.PI * 2 * u; return (Math.sin(w) + .55 * Math.sin(2 * w + .8) + .35 * Math.sin(3 * w + 2.1) + .2 * Math.sin(7 * w + .4)) / 1.55; },
        pulses: function (u) { var bits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0]; return bits[Math.min(bits.length - 1, Math.floor(u * bits.length))] ? .85 : -.85; },
        pwm: function (u) { var k = Math.floor(u * 10), f = u * 10 - k; var duty = .5 + .38 * Math.sin(2 * Math.PI * (k + .5) / 10); return f < duty ? .85 : -.85; }
    };
    function wavePath(kind, b) {
        var f = WAVES[kind], d = '', n = 400;
        for (var i = 0; i <= n; i++) {
            var u = i / n, y = 30 - 22 * f(Math.min(u, .9999), b);
            d += (i ? 'L' : 'M') + (u * 200).toFixed(1) + ' ' + y.toFixed(1);
        }
        return d;
    }
    // SRAM reads: the bitline discharges, then is precharged straight back up and the next
    // read starts at once - one continuous trace
    function bitlinePath() {
        var d = '', top = (30 - 22 * .8).toFixed(1);
        for (var k = 0; k < 4; k++) {
            for (var i = 0; i <= 60; i++) {
                var h = i / 60, u = (k + h) / 4;
                var y = 30 - 22 * (.8 - 1.5 * (1 - Math.exp(-h * 3.6)) / (1 - Math.exp(-3.6)));
                d += (k || i ? 'L' : 'M') + (u * 200).toFixed(1) + ' ' + y.toFixed(1);
            }
            d += 'V' + top;
        }
        return d;
    }
    function waveSVG(kind) {
        var paths = '<path class="ax" d="M0 30 H200"/><path d="' + (kind === 'bitline' ? bitlinePath() : wavePath(kind)) + '"/>';
        return '<svg class="wave" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">' + paths + '</svg>';
    }

    // ================= CH1: projects =================
    $('#caps').innerHTML = PROJECTS.map(function (p, i) {
        return '<button class="capc" type="button" data-proj="' + p.id + '">' +
            '<span class="cn"><span>CAPTURE ' + pad2(i + 1) + '</span><span>' + esc(p.tag) + '</span></span>' +
            waveSVG(p.wave) +
            '<span class="ct">' + esc(p.title) + '</span>' +
            '<span class="cs">' + esc(p.hint) + '</span></button>';
    }).join('');

    function renderProject(p) {
        var prev = PROJECTS[(p.n + PROJECTS.length - 1) % PROJECTS.length], next = PROJECTS[(p.n + 1) % PROJECTS.length];
        var links = p.links.map(function (l) { return '<a class="soft" href="' + esc(l[1]) + '"' + ext(l[1]) + '>' + esc(l[0]) + ' ▸</a>'; }).join('');
        if (p.video) links += '<button class="soft" type="button" data-video="' + esc(p.video[0]) + '" data-title="' + esc(p.video[1]) + '">▶ Video</button>';
        $('#s-proj').innerHTML =
            '<div class="pd-top"><button class="soft" type="button" data-go="ch1">◂ All captures</button><span class="dim" style="font-size:11.5px;letter-spacing:.1em">CAPTURE ' + pad2(p.n + 1) + ' / ' + pad2(PROJECTS.length) + '</span></div>' +
            '<h3>' + esc(p.title) + '</h3><div class="cat">' + esc(p.cat) + '</div>' +
            waveSVG(p.wave) +
            '<div class="pd-body' + (p.img ? '' : ' noimg') + '"><div>' +
            measHTML(p.meas) +
            (p.text ? '<p>' + mdInline(p.text) + '</p>' : '') + (links ? '<div class="pd-links">' + links + '</div>' : '') + '</div>' +
            (p.img ? '<figure class="phos" tabindex="0" aria-label="' + esc(p.imgAlt) + ' (hover for color)"><img src="' + esc(p.img) + '" alt="' + esc(p.imgAlt) + '"></figure>' : '') +
            '</div>' +
            (p.body ? '<h2 class="wu">Write-up</h2><div class="md">' + md(p.body) + '</div>' : '') +
            (PROJECTS.length > 1 ? '<nav class="pd-nav" aria-label="Captures"><button class="soft" type="button" data-go="ch1:' + prev.id + '">◂ ' + esc(prev.title) + '</button>' +
            '<button class="soft" type="button" data-go="ch1:' + next.id + '">' + esc(next.title) + ' ▸</button></nav>' : '');
        fixLinks($('#s-proj'));
    }

    // CH2: an organization's full write-up
    function renderDoc(id) {
        var f = DOCS[id], rs = ROLES.filter(function (r) { return r.file === id; });
        if (rs.length && (!ROLE[sel] || ROLE[sel].file !== id)) sel = rs[0].id;
        var links = list(f.meta.links).map(function (l) { return '<a class="soft" href="' + esc(l.url) + '"' + ext(l.url) + '>' + esc(l.label || l.url) + ' ▸</a>'; }).join('');
        $('#s-doc').innerHTML =
            '<div class="pd-top"><button class="soft" type="button" data-go="ch2">◂ Timeline</button></div>' +
            '<h3>' + esc(f.meta.org || id) + '</h3>' +
            '<div class="doc-roles">' + rs.map(function (r) { return '<div><b>' + esc(r.t) + '</b> <span class="dim">' + startOf(r) + ' → ' + endOf(r) + '</span></div>'; }).join('') + '</div>' +
            (links ? '<div class="pd-links">' + links + '</div>' : '') +
            '<div class="md">' + md(f.body) + '</div>';
        fixLinks($('#s-doc'));
    }

    // ================= CH2: experience timeline =================
    var AXIS_H = 24, LANE_H = 34;
    var sel = ROLES.length ? ROLES[0].id : null;
    var ORDER = ROLES.slice();   // newest first
    var tl = null;

    $('#tl-lanes').style.paddingTop = AXIS_H + 'px';
    $('#tl-lanes').innerHTML = LANES.map(function (l, i) { return '<div data-lane="' + i + '" style="height:' + LANE_H + 'px">' + l + '</div>'; }).join('');

    function tlRender() {
        var sc = $('#tl-scroll'), vw = sc.clientWidth;
        if (!vw) return;
        var span = AX1 - AX0 + 1;
        var modiv = CTL.timediv.vals[CTL.timediv.i];
        var pxm = Math.max(vw / span, vw / (10 * modiv));
        var Wd = Math.floor(span * pxm), Hs = AXIS_H + LANES.length * LANE_H + 4;
        var X = function (m) { return (m - AX0) * pxm; };
        var s = '<svg class="tl-svg" width="' + Wd + '" height="' + Hs + '" viewBox="0 0 ' + Wd + ' ' + Hs + '">';
        var every = pxm > 60 ? 1 : pxm > 19 ? 3 : 6;
        for (var m = AX0; m <= AX0 + span; m++) {
            var x = X(m).toFixed(1), mo = m % 12;
            s += '<line class="tick" x1="' + x + '" y1="' + (AXIS_H - 5) + '" x2="' + x + '" y2="' + (AXIS_H - (mo % 3 ? 2 : 0)) + '"/>';
            if (mo % 3 === 0) s += '<line class="grid" x1="' + x + '" y1="' + AXIS_H + '" x2="' + x + '" y2="' + Hs + '"/>';
            if (mo % every === 0 && X(m) + 50 < X(AX1) - 30) s += '<text class="axl" x="' + (X(m) + 3).toFixed(1) + '" y="' + (AXIS_H - 9) + '">' + MON[mo] + " '" + String(Math.floor(m / 12)).slice(2) + '</text>';
        }
        var nx = X(AX1).toFixed(1);
        s += '<line class="now" x1="' + nx + '" y1="4" x2="' + nx + '" y2="' + Hs + '"/>';
        s += '<text class="axl" x="' + (X(AX1) - 4).toFixed(1) + '" y="' + (AXIS_H - 9) + '" text-anchor="end">NOW</text>';

        var lanes = LANES.map(function () { return []; });
        ROLES.forEach(function (r) { lanes[r.lane].push(r); });
        var geo = {};
        lanes.forEach(function (rs, li) {
            rs.sort(function (a, b) { return a.s0 - b.s0; });
            var top = AXIS_H + li * LANE_H, y1 = top + 7, y0 = top + LANE_H - 7;
            var d = 'M0 ' + y0, ongoing = false;
            s += '<line class="base" x1="0" y1="' + y0 + '" x2="' + nx + '" y2="' + y0 + '"/>';
            rs.forEach(function (r) {
                var xs = X(r.s0), xe = X(r.e0);
                geo[r.id] = { xs: xs, xe: xe, y0: y0, y1: y1, top: top };
                d += ' L' + xs.toFixed(1) + ' ' + y0 + edge(xs, y0, y1);
                if (!r.e) { d += ' L' + xe.toFixed(1) + ' ' + y1; ongoing = true; }
                else d += ' L' + xe.toFixed(1) + ' ' + y1 + edge(xe, y1, y0);
                s += '<rect class="hit" data-role="' + r.id + '" x="' + xs.toFixed(1) + '" y="' + top + '" width="' + Math.max(8, xe - xs).toFixed(1) + '" height="' + LANE_H + '" tabindex="0" role="button" aria-label="' + esc(r.t + ', ' + r.org + ', ' + startOf(r) + ' to ' + endOf(r)) + '"/>';
                s += '<text class="pl" data-pl="' + r.id + '" x="' + (xs + 12).toFixed(1) + '" y="' + (y0 - 4) + '">' + esc(r.label) + '</text>';
            });
            if (!ongoing) d += ' L' + nx + ' ' + y0;
            s += '<path class="tr" d="' + d + '"/>';
            s += '<circle class="head" cx="' + nx + '" cy="' + (ongoing ? y1 : y0) + '" r="2.2"/>';
        });
        s += '<g id="tl-cur"></g></svg>';
        sc.innerHTML = s;
        tl = { X: X, geo: geo, Hs: Hs, Wd: Wd, vw: vw };
        tlSelect(sel, true);
        tlLabels();
    }
    // pulse labels ride along inside the visible part of their pulse, or hide if it's too narrow
    function tlLabels() {
        if (!tl) return;
        var left = $('#tl-scroll').scrollLeft, right = left + tl.vw;
        $$('#tl-scroll .pl').forEach(function (t) {
            var r = ROLE[t.getAttribute('data-pl')], g = tl.geo[r.id];
            var a = Math.max(g.xs + 10, left + 6), b = Math.min(g.xe - 5, right - 4);
            var txt = [r.label, r.short].filter(function (l) { return l && b - a >= l.length * 6.1 + 2; })[0];
            t.style.display = txt ? '' : 'none';
            if (txt) { t.textContent = txt; t.setAttribute('x', a.toFixed(1)); }
        });
    }
    $('#tl-scroll').addEventListener('scroll', tlLabels, { passive: true });
    // a real edge: finite rise time, a little overshoot and ringing
    function edge(x, from, to) {
        var a = to - from, sgn = a < 0 ? -1 : 1, o = 3.2 * sgn;
        return ' L' + (x + 3).toFixed(1) + ' ' + (to + o).toFixed(1) + ' L' + (x + 6).toFixed(1) + ' ' + (to - o * .4).toFixed(1) + ' L' + (x + 9).toFixed(1) + ' ' + (to + o * .12).toFixed(1) + ' L' + (x + 12).toFixed(1) + ' ' + to;
    }

    function tlSelect(id, scroll) {
        var r = ROLE[id];
        if (!r) return;
        sel = id;
        $$('#tl-scroll .hit').forEach(function (h) { h.setAttribute('aria-pressed', String(h.getAttribute('data-role') === id)); });
        $$('#tl-scroll .pl').forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-pl') === id); });
        $$('#tl-lanes div').forEach(function (l, i) { l.classList.toggle('on', i === r.lane); });
        if (tl) {
            var g = tl.geo[id], xs = g.xs, xe = g.xe;
            var d = 'M' + xs.toFixed(1) + ' ' + g.y0 + edge(xs, g.y0, g.y1) + ' L' + xe.toFixed(1) + ' ' + g.y1 + (r.e ? edge(xe, g.y1, g.y0) : '');
            var c = '<line class="cur" x1="' + xs.toFixed(1) + '" y1="' + (AXIS_H - 2) + '" x2="' + xs.toFixed(1) + '" y2="' + tl.Hs + '"/>' +
                    '<line class="cur" x1="' + xe.toFixed(1) + '" y1="' + (AXIS_H - 2) + '" x2="' + xe.toFixed(1) + '" y2="' + tl.Hs + '"/>' +
                    '<path class="trs" d="' + d + '"/>';
            $('#tl-cur').innerHTML = c;
            if (scroll) {
                var sc = $('#tl-scroll');
                sc.scrollLeft = (xs + xe) / 2 - tl.vw / 2;
            }
        }
        var ex = (r.doc ? '<button class="soft" type="button" data-go="ch2:' + esc(r.file) + '">Full write-up ▸</button>' : '') +
                 r.links.map(function (l) { return '<a class="soft" href="' + esc(l.url) + '"' + ext(l.url) + '>' + esc(l.label || l.url) + ' ▸</a>'; }).join('');
        $('#cbox').innerHTML =
            '<div class="cb-head"><span>C1 <b>' + startOf(r) + '</b></span><span>C2 <b>' + endOf(r) + '</b></span><span>Δt <b>' + dur(r.e0 - r.s0) + '</b></span></div>' +
            '<h3>' + esc(r.t) + '</h3><div class="org">' + esc(r.org) + '</div><p>' + mdInline(r.d) + '</p><div class="tags">' + esc(r.tags) + '</div>' +
            '<div class="cb-nav"><button class="soft" type="button" data-step="-1" aria-label="Previous role">◂</button><span class="n">' + (ORDER.indexOf(r) + 1) + ' / ' + ORDER.length + '</span><button class="soft" type="button" data-step="1" aria-label="Next role">▸</button><span class="sp"></span>' + ex + '</div>';
        if (cur === 'ch2') readouts();
    }
    $('#tl-scroll').addEventListener('pointerover', function (e) {
        var h = e.target.closest && e.target.closest('.hit');
        if (h && e.pointerType === 'mouse' && h.getAttribute('data-role') !== sel) { tlSelect(h.getAttribute('data-role')); }
    });
    $('#tl-scroll').addEventListener('click', function (e) {
        var h = e.target.closest && e.target.closest('.hit');
        if (h) { tlSelect(h.getAttribute('data-role')); tick(); }
    });
    $('#tl-scroll').addEventListener('focusin', function (e) {
        if (e.target.classList && e.target.classList.contains('hit')) tlSelect(e.target.getAttribute('data-role'));
    });
    $('#tl-scroll').addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('hit')) { e.preventDefault(); tlSelect(e.target.getAttribute('data-role')); }
    });
    $('#tl-lanes').addEventListener('click', function (e) {
        var l = e.target.closest('[data-lane]');
        if (!l) return;
        var lane = +l.getAttribute('data-lane');
        var rs = ORDER.filter(function (r) { return r.lane === lane; });
        var i = rs.indexOf(ROLE[sel]);
        tlSelect(rs[(i + 1) % rs.length].id, true);
    });
    $('#cbox').addEventListener('click', function (e) {
        var b = e.target.closest('[data-step]');
        if (!b) return;
        var i = ORDER.indexOf(ROLE[sel]) + (+b.getAttribute('data-step'));
        tlSelect(ORDER[(i + ORDER.length) % ORDER.length].id, true);
        tick();
    });

    // ================= CH3: step response =================
    (function () {
        var z = .32, wn = 17, wd = wn * Math.sqrt(1 - z * z), d = 'M0 130 H40', ts = 0;
        for (var i = 0; i <= 280; i++) {
            var t = i / 280, y = 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + z / Math.sqrt(1 - z * z) * Math.sin(wd * t));
            d += ' L' + (40 + t * 560).toFixed(1) + ' ' + (130 - 90 * y).toFixed(1);
            if (Math.abs(y - 1) > .05) ts = 40 + t * 560;
        }
        $('#resp').setAttribute('d', d);
        ['x1', 'x2'].forEach(function (a) { $('#ts').setAttribute(a, ts.toFixed(1)); });
    })();

    // ================= CH4: cursor panels =================
    $('#cursors').innerHTML = CUBES.map(function (c) {
        var w = clamp(Math.log(+c[1] + 1) / Math.log(42) * 100, 18, 96);
        return '<div class="cur-p"><div class="ev"><span>' + c[0] + '</span><span>CURSORS</span></div>' +
            '<svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 H4 V4 H' + (4 + w * .5).toFixed(1) + ' V12 H100" vector-effect="non-scaling-stroke"/><line x1="4" y1="0" x2="4" y2="16" vector-effect="non-scaling-stroke"/><line x1="' + (4 + w * .5).toFixed(1) + '" y1="0" x2="' + (4 + w * .5).toFixed(1) + '" y2="16" vector-effect="non-scaling-stroke"/></svg>' +
            '<div class="row"><span>Δt single</span><b>' + c[1] + ' s</b></div>' +
            '<div class="row"><span>Δt avg</span><b>' + c[2] + ' s</b></div></div>';
    }).join('');

    // ================= PROBE OUT: the calibrator square wave =================
    (function () {
        var d = 'M0 58', p = 50;
        for (var x = 0; x < 400; x += p) d += ' H' + (x + 6) + ' V12 H' + (x + 6 + p / 2) + ' V58';
        d += ' H400';
        $('#calwave').setAttribute('d', d);
    })();

    // ================= screens, readouts, routing =================
    var crt = $('#crt'), tube = $('#tube'), view = $('#view');
    var cur = null;
    var HASH = { xy: 'about', ch1: 'projects', ch2: 'experience', ch3: 'education', ch4: 'beyond', probe: 'contact' };
    var FROM = { about: 'xy', projects: 'ch1', experience: 'ch2', education: 'ch3', beyond: 'ch4', contact: 'probe' };
    var TITLE = { xy: 'About', ch1: 'Projects', ch2: 'Experience', ch3: 'Education', ch4: 'Beyond engineering', probe: 'Contact' };

    function base(key) { return key.split(':')[0]; }
    function fromHash() {
        var h = decodeURIComponent(location.hash.slice(1)).split('/');
        var k = FROM[h[0]];
        if (!k) return 'xy';
        if (k === 'ch1' && h[1] && PROJ[h[1]]) return 'ch1:' + h[1];
        if (k === 'ch2' && h[1]) {
            if (h[h.length - 1] === 'write-up' && DOCS[h[1]] && DOCS[h[1]].body) return 'ch2:' + h[1];
            var rid = h.slice(1).join('/'), first = ORDER.filter(function (r) { return r.file === h[1]; })[0];
            if (ROLE[rid]) sel = rid; else if (first) sel = first.id;
        }
        return k;
    }

    function readouts() {
        if (!cur) return;
        var k = base(cur), r;
        if (k === 'xy') r = ro(HOME.readouts, ['MODE X-Y', 'CH1 1V  CH2 1V', '', 'TRIG AUTO']);
        else if (k === 'ch1') {
            var p = PROJ[cur.split(':')[1]];
            r = p ? ['CH1  PROJECTS', 'CAPTURE ' + (p.n + 1) + '/' + PROJECTS.length, 'CH1 500mV DC', 'STORED'] : ['CH1  PROJECTS', PROJECTS.length + ' CAPTURE' + (PROJECTS.length === 1 ? '' : 'S'), 'CH1 500mV DC', 'TRIG ↑ 0.00V'];
        }
        else if (k === 'ch2' && cur.indexOf(':') > 0) r = ['CH2  EXPERIENCE', 'WRITE-UP', '', 'STORED'];
        else if (k === 'ch2') { var sr = ROLE[sel]; r = ['CH2  EXPERIENCE', sr ? startOf(sr) + ' → ' + endOf(sr) : '', ROLES.length + ' ROLES · ' + LANES.length + ' TRACES', CTL.timediv.vals[CTL.timediv.i] + ' mo/div']; }
        else if (k === 'ch3') r = ro(EDU.readouts, ['CH3  EDUCATION', 'STEP RESPONSE', '', '']);
        else if (k === 'ch4') r = ro(BEY.readouts, ['CH4  BEYOND ENG.', 'CURSORS  Δt', '', 'TRIG NORM']);
        else r = ro(CON.readouts, ['PROBE OUT', 'CAL 1 kHz  0.5 Vp-p', 'LINK READY', 'TRIG ↑']);
        $('#ro-tl').textContent = r[0]; $('#ro-tr').textContent = r[1];
        $('#ro-bl').textContent = r[2]; $('#ro-br').textContent = r[3];
    }

    function swap(key) {
        var k = base(key);
        if (typeof popDish === 'function') popDish(null);
        cur = key;
        var sub = key.indexOf(':') > 0 ? key.slice(key.indexOf(':') + 1) : '';
        var secId = sub ? (k === 'ch1' ? 's-proj' : 's-doc') : 's-' + k;
        if (secId === 's-proj') renderProject(PROJ[sub]);
        if (secId === 's-doc') renderDoc(sub);
        $$('#view .scr').forEach(function (s) { s.hidden = s.id !== secId; });
        view.scrollTop = 0;
        $$('.key[data-go]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-go') === k)); });
        var h = '#' + HASH[k] + (sub ? '/' + sub + (k === 'ch2' ? '/write-up' : '') : '');
        if (location.hash !== h) history.replaceState(null, '', h);
        document.title = (secId === 's-proj' ? PROJ[sub].title : secId === 's-doc' ? (DOCS[sub].meta.org || sub) : TITLE[k]) + ' · ' + (S.name || '');
        readouts();
        enter(k);
        moreCheck();
    }
    function enter(k) {
        if (k === 'ch2') tlRender();
        if (k === 'ch3') { var st = $('#step'); st.classList.remove('draw'); if (!reduced) { void st.getBoundingClientRect(); st.classList.add('draw'); } }
        if (k === 'probe') typeContact(); else typeGen++;
    }

    function moreCheck() {
        var more = view.scrollHeight - view.scrollTop - view.clientHeight > 6;
        $('#more').hidden = !more || !body.classList.contains('ready');
    }
    view.addEventListener('scroll', moreCheck, { passive: true });

    // typed by the beam, letter by letter
    var typeGen = 0;
    function typeContact() {
        var gen = ++typeGen, items = $$('#s-probe [data-type]');
        if (reduced) { items.forEach(function (el) { el.textContent = el.getAttribute('data-type'); el.classList.remove('typing'); }); return; }
        items.forEach(function (el) { el.textContent = ''; el.classList.remove('typing'); });
        var i = 0, j = 0;
        function step() {
            if (gen !== typeGen) return;
            var el = items[i];
            if (!el) return;
            var txt = el.getAttribute('data-type');
            el.classList.add('typing');
            el.textContent = txt.slice(0, ++j);
            if (j >= txt.length) {
                if (i < items.length - 1) el.classList.remove('typing');
                i++; j = 0;
                setTimeout(step, i % 2 ? 60 : 160);
            } else setTimeout(step, 16 + Math.random() * 22);
        }
        setTimeout(step, 260);
    }

    // ================= the beam (canvas) =================
    var beam = $('#beam'), grat = $('#grat');
    var ctx = beam.getContext('2d'), gctx = grat.getContext('2d');
    var W = 0, H = 0, VR = { x: 0, y: 0, w: 0, h: 0 }, I = 1;

    function size() {
        W = crt.clientWidth; H = crt.clientHeight;
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        [beam, grat].forEach(function (c) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        VR = { x: view.offsetLeft, y: view.offsetTop, w: view.offsetWidth, h: view.offsetHeight };
        nameCache.key = '';
        drawGrat();
    }

    // 10 x 8 division graticule, minor ticks on the centre axes
    function drawGrat() {
        var g = gctx, m = 12, gw = W - 2 * m, gh = H - 2 * m, dx = gw / 10, dy = gh / 8, i, x, y;
        g.clearRect(0, 0, W, H);
        g.lineWidth = 1;
        g.strokeStyle = 'rgba(120,255,170,.075)';
        g.beginPath();
        for (i = 0; i <= 10; i++) { x = Math.round(m + i * dx) + .5; g.moveTo(x, m); g.lineTo(x, m + gh); }
        for (i = 0; i <= 8; i++) { y = Math.round(m + i * dy) + .5; g.moveTo(m, y); g.lineTo(m + gw, y); }
        g.stroke();
        var cx = Math.round(m + 5 * dx) + .5, cy = Math.round(m + 4 * dy) + .5;
        g.strokeStyle = 'rgba(120,255,170,.15)';
        g.beginPath();
        for (i = 0; i <= 50; i++) { x = Math.round(m + i * dx / 5) + .5; g.moveTo(x, cy - 3); g.lineTo(x, cy + 3); }
        for (i = 0; i <= 40; i++) { y = Math.round(m + i * dy / 5) + .5; g.moveTo(cx - 3, y); g.lineTo(cx + 3, y); }
        g.stroke();
    }

    // ---- the name, as one continuous XY beam path ----
    var GLYPH = {
        N: { w: .72, p: [[0, 0], [0, 1], [.72, 0], [.72, 1]] },
        A: { w: .8, p: [[0, 0], [.4, 1], [.8, 0], [.64, .4], [.16, .4]] },
        Y: { w: .8, p: [[0, 1], [.4, .5], [.8, 1], [.4, .5], [.4, 0]] },
        M: { w: .9, p: [[0, 0], [0, 1], [.45, .36], [.9, 1], [.9, 0]] },
        R: { w: .74, p: (function () {
            var p = [[0, 0], [0, 1], [.4, 1]];
            for (var a = 80; a >= -80; a -= 20) p.push([.4 + .25 * Math.cos(a * Math.PI / 180), .75 + .25 * Math.sin(a * Math.PI / 180)]);
            p.push([.4, .5], [0, .5], [.28, .5], [.74, 0]);
            return p;
        })() }
    };
    var N = 900;
    var NAME = (function () {
        var raw = [], x = 0, gap = .3, prev = '';
        var KERN = { AY: -.17, YA: -.17 };   // diagonal next to diagonal: close the optical gap
        'NAYAN RAMAM'.split('').forEach(function (ch) {
            if (ch === ' ') { x += .55; prev = ''; return; }
            x += KERN[prev + ch] || 0;
            prev = ch;
            var g = GLYPH[ch];
            g.p.forEach(function (q, i) { raw.push({ x: x + q[0], y: q[1], d: i === 0 && raw.length > 0 }); });
            x += g.w + gap;
        });
        var w = x - gap, cum = [0];
        for (var i = 1; i < raw.length; i++) cum.push(cum[i - 1] + Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y));
        var L = cum[cum.length - 1], out = [], seg = 1;
        for (var k = 0; k < N; k++) {
            var s = L * k / (N - 1);
            while (seg < raw.length - 1 && cum[seg] < s) seg++;
            var a = raw[seg - 1], b = raw[seg], t = (s - cum[seg - 1]) / ((cum[seg] - cum[seg - 1]) || 1);
            out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, d: b.d });
        }
        return { pts: out, w: w };
    })();
    var nameCache = { key: '', pts: null };
    function relRect(el) {
        var a = el.getBoundingClientRect(), c = crt.getBoundingClientRect();
        return { x: a.left - c.left, y: a.top - c.top, w: a.width, h: a.height };
    }
    function namePts(r) {
        var key = [r.x | 0, r.y | 0, r.w | 0, r.h | 0].join();
        if (key === nameCache.key) return nameCache.pts;
        var s = Math.min(r.w * .96 / NAME.w, r.h * .86), ox = r.x + (r.w - NAME.w * s) / 2, oy = r.y + (r.h + s) / 2;
        nameCache.key = key;
        nameCache.pts = NAME.pts.map(function (p) { return { x: ox + p.x * s, y: oy - p.y * s, d: p.d }; });
        return nameCache.pts;
    }

    function polyline(pts, dim, from, to) {
        ctx.beginPath();
        var pen = false;
        for (var i = (from || 0) + 1; i < (to || pts.length); i++) {
            if (!!pts[i].d !== dim) { pen = false; continue; }
            if (!pen) { ctx.moveTo(pts[i - 1].x, pts[i - 1].y); pen = true; }
            ctx.lineTo(pts[i].x, pts[i].y);
        }
    }
    function trace(pts, a) {
        a = (a == null ? 1 : a) * I;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        polyline(pts, false);
        ctx.strokeStyle = 'rgba(60,255,130,' + (.012 * a) + ')'; ctx.lineWidth = 11; ctx.stroke();
        ctx.strokeStyle = 'rgba(80,255,140,' + (.024 * a) + ')'; ctx.lineWidth = 4.5; ctx.stroke();
        ctx.strokeStyle = 'rgba(165,255,200,' + (.4 * a) + ')'; ctx.lineWidth = 1.9; ctx.stroke();
        polyline(pts, true);
        ctx.strokeStyle = 'rgba(110,255,160,' + (.016 * a) + ')'; ctx.lineWidth = 1; ctx.stroke();
    }
    function dot(x, y, a) {
        a = clamp(a, 0, 1) * I;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, 'rgba(235,255,240,' + a + ')');
        g.addColorStop(.25, 'rgba(120,255,170,' + (.5 * a) + ')');
        g.addColorStop(1, 'rgba(60,255,130,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill();
    }
    function hline(x1, x2, y, a) {
        trace([{ x: x1, y: y }, { x: x2, y: y }], a);
    }

    // ---- the animation loop: persistence = fade a little every frame ----
    var running = false, last = 0, linger = 0, headK = 0;
    var intro = null, tr = null, shut = null, power = false;
    function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
    function frame(now) {
        var dt = Math.min(64, now - last); last = now;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,' + (1 - Math.exp(-dt / 110)) + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
        var busy = false;
        if (shut) busy = stepShut(now) || busy;
        if (intro) busy = stepIntro(now) || busy;
        if (tr) busy = stepTransition(now) || busy;
        var st = sigState();
        if (st) { drawSig(st, dt); busy = true; }
        if (busy) linger = now + 900;
        if (now < linger) requestAnimationFrame(frame);
        else { ctx.clearRect(0, 0, W, H); running = false; }
    }

    function sigState() {
        if (!power || intro || shut) return null;
        if (tr) {
            if (tr.phase === 'collapse' && tr.from === 'xy') return { squash: tr.p, rect: tr.sigRect };
            if (tr.phase === 'sweep' && tr.to === 'xy') return { clipX: tr.x };
            return null;
        }
        return cur === 'xy' ? {} : null;
    }
    function drawSig(st, dt) {
        var r = st.rect || relRect($('#sig'));
        if (r.h < 4 || r.y + r.h < VR.y || r.y > VR.y + VR.h) return;
        var pts = namePts(r);
        if (st.squash) {
            var cy = H / 2, k = Math.max(.01, 1 - st.squash);
            pts = pts.map(function (p) { return { x: p.x, y: cy + (p.y - cy) * k, d: p.d }; });
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(VR.x - 4, VR.y, (st.clipX != null ? st.clipX - VR.x : VR.w + 8), VR.h);
        ctx.clip();
        trace(pts, 1);
        if (!reduced && !st.squash) {
            // the beam itself, re-tracing the name; persistence leaves the afterglow
            var from = Math.floor(headK);
            headK = (headK + dt / 2600 * N) % N;
            var to = Math.floor(headK);
            ctx.lineCap = 'round';
            var drawSeg = function (a, b) {
                polyline(pts, false, a, b + 1);
                ctx.strokeStyle = 'rgba(90,255,150,' + (.12 * I) + ')'; ctx.lineWidth = 7; ctx.stroke();
                ctx.strokeStyle = 'rgba(235,255,242,' + (.95 * I) + ')'; ctx.lineWidth = 2.2; ctx.stroke();
            };
            if (to >= from) drawSeg(from, to); else { drawSeg(from, N - 1); drawSeg(0, to); }
            if (!pts[to].d) dot(pts[to].x, pts[to].y, .8);
        }
        ctx.restore();
    }

    // ---- power-on: dot, line, oscillation, then the name in X-Y ----
    var T = [250, 550, 900, 1500, 2300, 2600, 3000];
    function startIntro(kind, target) {
        intro = { t0: performance.now(), k: kind === 'short' ? .4 : 1, target: target };
        swap(target);
        if (target === 'xy') view.classList.add('pre'); else view.classList.add('blank');
        $('#skip').hidden = false;
        kick();
    }
    function stepIntro(now) {
        var t = (now - intro.t0) / intro.k, cx = W / 2, cy = H / 2;
        if (t < T[0]) return true;
        if (t < T[1]) { dot(cx, cy, (t - T[0]) / (T[1] - T[0])); return true; }
        if (t < T[2]) { var hw = easeOut((t - T[1]) / (T[2] - T[1])) * W * .42; hline(cx - hw, cx + hw, cy, 1); dot(cx + hw, cy, .5); return true; }
        if (intro.target !== 'xy') {
            var target = intro.target;
            endIntro();
            tr = { from: null, to: target, phase: 'sweep', t1: now, lx: 8, x: 8 };
            view.classList.remove('blank');
            view.style.clipPath = 'inset(0 100% 0 0)';
            return true;
        }
        var sig = namePts(relRect($('#sig')));
        var amp, e = 0, ph = t / 1000 * 7;
        if (t < T[3]) amp = easeOut((t - T[2]) / (T[3] - T[2])) * H * .1;
        else { amp = H * .1; e = easeInOut(clamp((t - T[3]) / (T[4] - T[3]), 0, 1)); }
        var x0 = cx - W * .42, span = W * .84, pts = new Array(N);
        for (var i = 0; i < N; i++) {
            var u = i / (N - 1), sx = x0 + span * u, sy = cy - amp * Math.sin(2 * Math.PI * 3 * u + ph), q = sig[i];
            pts[i] = { x: sx + (q.x - sx) * e, y: sy + (q.y - sy) * e, d: e > .55 && q.d };
        }
        trace(pts, 1);
        if (t >= T[4]) view.classList.add('in-1');
        if (t >= T[5]) { view.classList.add('in-2'); ready(); }
        if (t >= T[6]) endIntro();
        return true;
    }
    function endIntro() {
        intro = null;
        view.classList.remove('pre', 'in-1', 'in-2', 'blank');
        $('#skip').hidden = true;
        ready();
        store.set('nr2028.warm', '1');
    }
    function skipIntro() {
        if (!intro) return;
        endIntro();
        kick();
    }
    function ready() {
        if (body.classList.contains('ready')) return;
        body.classList.add('ready');
        moreCheck();
    }

    // ---- screen change: collapse to a flat line, then the beam sweeps the new screen in ----
    var TC = 130, TS = 330;
    function go(key, opts) {
        opts = opts || {};
        if (!key) return;
        if (!power) { powerOn(key); return; }
        if (shut) return;
        if (intro) skipIntro();
        if (tr) finishTransition();
        closePlayer();
        if (key === cur) { if (base(key) === 'ch2') tlRender(); return; }
        if (reduced || opts.instant) {
            swap(key);
            view.animate && view.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 140 });
            return;
        }
        tr = { from: cur, to: key, t0: performance.now(), phase: 'collapse', p: 0, sigRect: cur === 'xy' ? relRect($('#sig')) : null };
        kick();
    }
    function stepTransition(now) {
        var cy = H / 2;
        if (tr.phase === 'collapse') {
            var p = Math.min(1, (now - tr.t0) / TC);
            tr.p = p * p;
            view.style.transform = 'scaleY(' + Math.max(.004, 1 - tr.p) + ')';
            view.style.filter = 'brightness(' + (1 + tr.p) + ')';
            hline(VR.x, VR.x + VR.w, cy, .25 + .75 * tr.p);
            if (p >= 1) {
                swap(tr.to);
                view.style.transform = ''; view.style.filter = '';
                view.style.clipPath = 'inset(0 100% 0 0)';
                tr.phase = 'sweep'; tr.t1 = now; tr.lx = 8; tr.x = 8;
            }
            return true;
        }
        var q = Math.min(1, (now - tr.t1) / TS), x = 8 + (W - 16) * (q * (2 - q) * .5 + q * .5);
        view.style.clipPath = 'inset(0 ' + Math.max(0, VR.x + VR.w - x).toFixed(1) + 'px 0 0)';
        hline(tr.lx, x, cy, 1);
        dot(x, cy, .55);
        tr.lx = x; tr.x = x;
        if (q >= 1) { view.style.clipPath = ''; tr = null; moreCheck(); }
        return true;
    }
    function finishTransition() {
        if (!tr) return;
        if (tr.phase === 'collapse') swap(tr.to);
        view.style.transform = ''; view.style.filter = ''; view.style.clipPath = '';
        tr = null;
    }

    // ---- power switch ----
    function powerOn(target) {
        if (power) return;
        power = true;
        $('#power').setAttribute('aria-pressed', 'true');
        body.classList.remove('off');
        hum(true);
        if (reduced) { swap(target || 'xy'); ready(); kick(); return; }
        startIntro(store.get('nr2028.warm') ? 'short' : 'full', target || cur || 'xy');
    }
    function powerOff() {
        if (!power) return;
        if (intro) { intro = null; view.classList.remove('pre', 'in-1', 'in-2', 'blank'); $('#skip').hidden = true; }
        finishTransition();
        closePlayer();
        power = false;
        $('#power').setAttribute('aria-pressed', 'false');
        body.classList.remove('ready');
        $('#more').hidden = true;
        hum(false);
        if (reduced) { body.classList.add('off'); return; }
        shut = { t0: performance.now() };
        kick();
    }
    function stepShut(now) {
        var t = now - shut.t0, cx = W / 2, cy = H / 2;
        if (t < 150) { view.style.transform = 'scaleY(' + Math.max(.004, 1 - t / 150) + ')'; hline(VR.x, VR.x + VR.w, cy, 1); }
        else if (t < 420) { view.style.visibility = 'hidden'; var hw = (VR.w / 2) * (1 - easeOut((t - 150) / 270)); hline(cx - hw, cx + hw, cy, 1); }
        else if (t < 1100) { dot(cx, cy, 1 - (t - 420) / 680); }
        else { shut = null; view.style.transform = ''; view.style.visibility = ''; body.classList.add('off'); return false; }
        return true;
    }
    $('#power').addEventListener('click', function () { press(this); power ? powerOff() : powerOn(cur || 'xy'); });

    // ================= front-panel buttons =================
    function press(el) {
        el.classList.add('down');
        setTimeout(function () { el.classList.remove('down'); }, 110);
        tick();
    }
    document.addEventListener('click', function (e) {
        var g = e.target.closest('[data-go]');
        if (g) {
            e.preventDefault();
            if (g.classList.contains('key')) press(g); else tick();
            var k = g.getAttribute('data-go');
            if (cur && k === base(cur) && cur.indexOf(':') > 0) { go(k); return; }
            go(k);
            return;
        }
        var pr = e.target.closest('[data-print]');
        if (pr) {
            if (pr.classList.contains('key')) { press(pr); pr.classList.add('blink'); setTimeout(function () { pr.classList.remove('blink'); }, 700); }
            flash('PRINT → RESUME.PDF');
            return;   // the link opens the PDF in a new tab
        }
        var p = e.target.closest('[data-proj]');
        if (p) { tick(); go('ch1:' + p.getAttribute('data-proj')); return; }
        var v = e.target.closest('[data-video]');
        if (v) { tick(); openPlayer(v.getAttribute('data-video'), v.getAttribute('data-title'), v); return; }
        var d = e.target.closest('.dish');
        if (d) { popDish(popFor === d && e.pointerType !== 'mouse' ? null : d); return; }
        if (popFor) popDish(null);
    });
    $('#skip').addEventListener('click', function (e) { e.stopPropagation(); skipIntro(); });
    crt.addEventListener('click', function (e) { if (intro && !e.target.closest('a,button')) skipIntro(); });

    window.addEventListener('hashchange', function () {
        var k = fromHash();
        if (k !== cur) go(k);
        else if (base(k) === 'ch2') tlSelect(sel, true);
    });

    document.addEventListener('keydown', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.key === 'Escape') {
            if (popFor) { popDish(null); return; }
            if (!$('#player').hidden) { closePlayer(true); return; }
            if (intro) { skipIntro(); return; }
            if (cur && cur.indexOf(':') > 0) { go(base(cur)); return; }
            return;
        }
        var t = e.target;
        if (t && (t.isContentEditable || /input|textarea|select/i.test(t.tagName))) return;
        if (t && t.classList && t.classList.contains('knob')) return;
        var map = { x: 'xy', '0': 'xy', '1': 'ch1', '2': 'ch2', '3': 'ch3', '4': 'ch4', p: 'probe' };
        var k = map[e.key.toLowerCase()];
        if (k) {
            var b = $('.ctrls .key[data-go="' + k + '"]');
            if (b) press(b);
            go(k);
        } else if (intro && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); skipIntro(); }
    });

    // ================= dish pop-up readout =================
    var dishes = $$('.dish'), pop = $('#dishpop'), popFor = null;
    function popDish(d) {
        if (popFor) { popFor.setAttribute('aria-expanded', 'false'); popFor.removeAttribute('aria-describedby'); }
        popFor = d;
        if (!d) { pop.hidden = true; return; }
        $('#dp-n').textContent = (dishes.indexOf(d) + 1) + '/' + dishes.length;
        $('#dp-t').textContent = d.querySelector('.nm').textContent;
        $('#dp-d').textContent = d.getAttribute('data-desc');
        d.setAttribute('aria-expanded', 'true');
        d.setAttribute('aria-describedby', 'dishpop');
        pop.hidden = false;
        placePop();
    }
    // beside the photo if there's room, otherwise on the other side; kept inside the screen
    function placePop() {
        if (!popFor) return;
        var r = relRect(popFor.querySelector('.phos')), pw = pop.offsetWidth, ph = pop.offsetHeight, gap = 14, x, side;
        if (r.y + r.h < VR.y || r.y > VR.y + VR.h) { popDish(null); return; }
        if (r.x + r.w + gap + pw <= VR.x + VR.w) { x = r.x + r.w + gap; side = 'r'; }
        else if (r.x - gap - pw >= VR.x) { x = r.x - gap - pw; side = 'l'; }
        else { x = clamp(r.x + r.w / 2 - pw / 2, VR.x, VR.x + VR.w - pw); side = ''; }
        var y = clamp(r.y + 6, VR.y, VR.y + VR.h - ph);
        pop.className = 'pop' + (side ? ' ' + side : '');
        pop.style.left = x + 'px';
        pop.style.top = y + 'px';
    }
    dishes.forEach(function (d) {
        d.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') popDish(d); });
        d.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && popFor === d) popDish(null); });
        d.addEventListener('focus', function () { if (d.matches(':focus-visible')) popDish(d); });   // keyboard only; taps are handled by click
        d.addEventListener('blur', function () { if (popFor === d) popDish(null); });
    });
    view.addEventListener('scroll', placePop, { passive: true });

    // ================= video player (on the screen) =================
    var lastFocus = null;
    function openPlayer(id, title, from) {
        lastFocus = from || document.activeElement;
        $('#pl-title').textContent = title || 'VIDEO';
        $('#pl-frame').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="' + esc(title || 'Video') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        $('#player').hidden = false;
        $('#pl-close').focus();
    }
    function closePlayer(refocus) {
        if ($('#player').hidden) return;
        $('#pl-frame').innerHTML = '';
        $('#player').hidden = true;
        if (refocus && lastFocus && lastFocus.focus) lastFocus.focus();
    }
    $('#pl-close').addEventListener('click', function () { closePlayer(true); });
    $('#player').addEventListener('click', function (e) { if (e.target === this) closePlayer(true); });

    // ================= knobs =================
    var CTL = {
        timediv: { n: 4, i: window.innerWidth < 600 ? 2 : 0, vals: [3, 2, 1, .5], label: 'TIME/DIV', size: '',
            fmt: function (i) { return 'TIME/DIV  ' + this.vals[i] + ' mo'; },
            on: function () { if (cur === 'ch2') tlRender(); readouts(); } },
        intensity: { n: 11, i: 6, label: 'INTENSITY',
            fmt: function (i) { return 'INTENSITY  ' + i * 10 + '%'; },
            on: function (i) { var g = i / 6; document.documentElement.style.setProperty('--g', g.toFixed(2)); I = .35 + .65 * Math.min(1.4, g); kick(); } },
        focus: { n: 11, i: 5, label: 'FOCUS', spring: true,
            fmt: function (i) { return i === 5 ? 'FOCUS  ●' : 'FOCUS  ' + (i > 5 ? '+' : '') + (i - 5); },
            on: function (i) { tube.style.filter = i === 5 ? '' : 'blur(' + (Math.abs(i - 5) * .75).toFixed(2) + 'px)'; } },
        position: { endless: true, i: 0, label: '▲▼ POSITION',
            fmt: function () { return 'POSITION'; },
            on: function (i, d) { view.scrollBy({ top: d * 64, behavior: reduced ? 'auto' : 'smooth' }); } }
    };
    function angle(c, i) { return c.endless ? i * 22 : -135 + 270 * i / (c.n - 1); }

    $$('[data-knob]').forEach(function (w) {
        var name = w.getAttribute('data-knob'), c = CTL[name], sm = w.getAttribute('data-size') === 'sm';
        var ticks = '';
        var n = c.endless ? 16 : c.n;
        for (var i = 0; i < n; i++) {
            var a = c.endless ? i * 22.5 : angle(c, i), R = (sm ? 40 : 58) / 2 + 6;
            var maj = !c.endless && (i === 0 || i === n - 1 || (name === 'focus' && i === 5));
            ticks += '<i class="tk' + (maj ? ' maj' : '') + '" style="transform:rotate(' + a + 'deg) translateY(-' + R + 'px)"></i>';
        }
        w.innerHTML = '<div class="knob' + (sm ? ' sm' : '') + '" role="slider" tabindex="0" aria-label="' + c.label + '"' +
            (c.endless ? ' aria-valuetext="scroll the screen"' : ' aria-valuemin="0" aria-valuemax="' + (c.n - 1) + '"') + '>' + ticks + '<div class="rot"></div></div><span class="lab silk">' + c.label + '</span>';
        bindKnob(w.firstChild, name);
    });
    function syncKnobs(name) {
        var c = CTL[name];
        $$('[data-knob="' + name + '"] .knob').forEach(function (k) {
            k.style.setProperty('--a', angle(c, c.i) + 'deg');
            if (!c.endless) { k.setAttribute('aria-valuenow', c.i); k.setAttribute('aria-valuetext', c.fmt(c.i)); }
        });
    }
    var springT = null;
    function setCtl(name, i, quiet) {
        var c = CTL[name];
        if (c.endless) { var d = i - c.i; c.i = i; syncKnobs(name); if (d) c.on(i, d); if (!quiet) { tick(.35); } return; }
        i = clamp(i, 0, c.n - 1);
        if (i === c.i) return;
        c.i = i;
        syncKnobs(name);
        c.on(i);
        if (!quiet) { tick(.35); flash(c.fmt(i)); }
        if (c.spring) {
            clearTimeout(springT);
            springT = setTimeout(function back() {
                if (c.i === 5) { flash('FOCUS  ● AUTO'); return; }
                setCtl(name, c.i + (c.i > 5 ? -1 : 1), true);
                springT = setTimeout(back, 70);
            }, 750);
        }
    }
    function bindKnob(el, name) {
        var c = CTL[name], drag = null, acc = 0;
        el.addEventListener('pointerdown', function (e) {
            if (e.button !== 0) return;
            el.setPointerCapture(e.pointerId);
            drag = { x: e.clientX, y: e.clientY, i: c.i, moved: false };
            el.classList.add('dragging');
        });
        el.addEventListener('pointermove', function (e) {
            if (!drag) return;
            var d = (drag.y - e.clientY) + (e.clientX - drag.x);
            if (Math.abs(d) > 5) drag.moved = true;
            if (drag.moved) setCtl(name, drag.i + Math.round(d / 14));
        });
        function up(e) {
            if (!drag) return;
            el.classList.remove('dragging');
            if (!drag.moved && e.type === 'pointerup') {
                var r = el.getBoundingClientRect();
                setCtl(name, c.i + (e.clientX >= r.left + r.width / 2 ? 1 : -1));
            }
            drag = null;
        }
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        el.addEventListener('wheel', function (e) {
            e.preventDefault();
            acc += -e.deltaY || e.deltaX;
            if (Math.abs(acc) >= 40 || e.deltaMode === 1) { setCtl(name, c.i + (acc > 0 || (e.deltaMode === 1 && e.deltaY < 0) ? 1 : -1)); acc = 0; }
        }, { passive: false });
        el.addEventListener('keydown', function (e) {
            var k = e.key, d = 0;
            if (k === 'ArrowUp' || k === 'ArrowRight' || k === 'PageUp') d = 1;
            else if (k === 'ArrowDown' || k === 'ArrowLeft' || k === 'PageDown') d = -1;
            else if (k === 'Home' && !c.endless) { e.preventDefault(); setCtl(name, 0); return; }
            else if (k === 'End' && !c.endless) { e.preventDefault(); setCtl(name, c.n - 1); return; }
            if (d) { e.preventDefault(); setCtl(name, c.i + (name === 'position' ? -d : d)); }
        });
    }
    Object.keys(CTL).forEach(syncKnobs);

    var flashT = null;
    function flash(txt) {
        var f = $('#flash');
        f.textContent = txt;
        f.classList.add('on');
        clearTimeout(flashT);
        flashT = setTimeout(function () { f.classList.remove('on'); }, 1100);
    }

    // ================= sound: off by default, never auto-plays =================
    var actx = null, soundOn = false, humNodes = null;
    function audio() {
        if (!actx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; actx = new AC(); }
        if (actx.state === 'suspended') actx.resume();
        return actx;
    }
    function tick(vol) {
        if (!soundOn) return;
        var a = audio(); if (!a) return;
        var t = a.currentTime, len = Math.floor(a.sampleRate * .035), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0);
        for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
        var src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
        src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = .9;
        g.gain.value = .5 * (vol || 1);
        src.connect(bp); bp.connect(g); g.connect(a.destination);
        src.start(t);
        var o = a.createOscillator(), og = a.createGain();
        o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + .04);
        og.gain.setValueAtTime(.12 * (vol || 1), t); og.gain.exponentialRampToValueAtTime(.0001, t + .05);
        o.connect(og); og.connect(a.destination); o.start(t); o.stop(t + .06);
    }
    function hum(on) {
        if (on && soundOn && power && !humNodes) {
            var a = audio(); if (!a) return;
            var g = a.createGain(), lp = a.createBiquadFilter();
            lp.type = 'lowpass'; lp.frequency.value = 400;
            g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(.022, a.currentTime + .6);
            var o1 = a.createOscillator(), o2 = a.createOscillator(), g2 = a.createGain();
            o1.frequency.value = 60; o2.frequency.value = 120; g2.gain.value = .45;
            o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(a.destination);
            o1.start(); o2.start();
            humNodes = { g: g, o: [o1, o2] };
        } else if (!on && humNodes) {
            var n = humNodes, t = actx.currentTime;
            humNodes = null;
            n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0, t + .25);
            n.o.forEach(function (o) { o.stop(t + .3); });
        }
    }
    $('#sound').addEventListener('click', function () {
        soundOn = !soundOn;
        this.setAttribute('aria-pressed', String(soundOn));
        this.setAttribute('aria-label', 'Sound (' + (soundOn ? 'on' : 'off') + ')');
        press(this);
        hum(soundOn);
    });

    // ================= wear: scratches, uneven yellowing, parts that don't sit quite square =================
    (function () {
        var seed = 2028;
        function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
        var d = '', w = 900, h = 700;
        for (var i = 0; i < 46; i++) {
            var x = rnd() * w, y = rnd() * h, len = 6 + Math.pow(rnd(), 2.2) * 120, a = (rnd() - .5) * 1.3 + (rnd() < .5 ? 0 : Math.PI);
            var x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, cx = (x + x2) / 2 + (rnd() - .5) * 3, cy = (y + y2) / 2 + (rnd() - .5) * 3;
            var light = rnd() < .62;
            d += "<path d='M" + x.toFixed(0) + ' ' + y.toFixed(0) + 'Q' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ' ' + x2.toFixed(0) + ' ' + y2.toFixed(0) +
                 "' stroke='" + (light ? 'rgba(255,252,240,' + (.14 + rnd() * .2).toFixed(2) + ')' : 'rgba(70,55,30,' + (.08 + rnd() * .12).toFixed(2) + ')') +
                 "' stroke-width='" + (.35 + rnd() * .5).toFixed(2) + "' fill='none'/>";
        }
        for (var j = 0; j < 14; j++) {   // scuffs and small chips
            d += "<ellipse cx='" + (rnd() * w).toFixed(0) + "' cy='" + (rnd() * h).toFixed(0) + "' rx='" + (1 + rnd() * 5).toFixed(1) + "' ry='" + (.6 + rnd() * 2).toFixed(1) +
                 "' fill='rgba(" + (rnd() < .5 ? '80,62,30,.18' : '255,250,235,.3') + ")'/>";
        }
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" + d + '</svg>';
        document.documentElement.style.setProperty('--scratch', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
        $$('.key .cap, .power .sw').forEach(function (c) {
            c.style.setProperty('--jit', ((rnd() - .5) * 1.4).toFixed(2) + 'deg');
            c.style.setProperty('--age', 'sepia(' + (rnd() * .3).toFixed(2) + ') brightness(' + (.95 + rnd() * .06).toFixed(3) + ')');
        });
        $$('.knob .rot').forEach(function (r) { r.style.setProperty('--jit', ((rnd() - .5) * 6).toFixed(1) + 'deg'); });
    })();

    // ================= boot =================
    window.addEventListener('resize', function () {
        size();
        placePop();
        if (cur === 'ch2') tlRender();
        moreCheck();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) hum(false); else hum(true); });

    size();
    var target = fromHash();
    if (reduced) {
        power = true;
        $('#power').setAttribute('aria-pressed', 'true');
        body.classList.remove('off');
        swap(target);
        ready();
        kick();
    } else {
        setTimeout(function () { powerOn(target); }, 260);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { nameCache.key = ''; if (cur === 'ch2') tlRender(); moreCheck(); });
};

// Power-on: read the markdown, then build the scope. If anything goes wrong, say so on the screen.
(function () {
    function noSignal(err) {
        if (window.console) console.error(err);
        var body = document.body, view = document.getElementById('view');
        body.classList.remove('off');
        body.classList.add('ready');
        var local = location.protocol === 'file:';
        view.innerHTML = '<section class="scr"><h2>No signal</h2><p>' +
            (local ? 'This page was opened straight from disk, so the browser won\u2019t load the content files. ' +
                     'In the site folder run <code>python -m http.server</code>, then open <code>http://localhost:8000</code>.'
                   : 'The content couldn\u2019t be read. The problem:') +
            '</p><pre class="err"></pre></section>';
        view.querySelector('.err').textContent = String((err && err.message) || err);
        document.getElementById('ro-tl').textContent = 'NO SIGNAL';
    }
    if (!window.jsyaml || !window.marked) { noSignal(new Error('the markdown/YAML readers (js-yaml, marked) failed to load from the CDN')); return; }
    window.loadContent().then(function (data) { window.startScope(data); }).catch(noSignal);
})();
