/* Reads the site's content from the markdown files in content/.
 *
 * Each file is optional YAML front matter between two --- lines, then markdown. content/site.md
 * lists which project and experience files exist (a browser can't list a folder), so every file
 * named there is fetched in parallel and handed to the scope as plain objects:
 *   { meta: {front matter}, body: 'markdown', id: 'file-name' }
 */
window.loadContent = (function () {
    'use strict';

    function fetchText(path) {
        return fetch(path, { cache: 'no-cache' }).then(function (r) {
            if (!r.ok) throw new Error('could not load ' + path + ' (HTTP ' + r.status + ')');
            return r.text();
        });
    }

    function parse(text, path) {
        var m = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(text);
        var meta = {}, body = text;
        if (m) {
            try { meta = window.jsyaml.load(m[1]) || {}; }
            catch (e) { throw new Error(path + ': ' + e.message); }
            body = m[2];
        }
        // the page title comes from the front matter, so a leading "# Title" line is dropped
        body = body.replace(/^\s*#\s[^\n]*\n/, '').trim();
        return { meta: meta, body: body };
    }

    function load(name) {
        var path = 'content/' + name + '.md';
        return fetchText(path).then(function (t) {
            var f = parse(t, path);
            f.id = name.split('/').pop();
            return f;
        });
    }

    return function () {
        return load('site').then(function (site) {
            var s = site.meta;
            return Promise.all([
                Promise.all((s.projects || []).map(function (id) { return load('projects/' + id); })),
                Promise.all((s.experience || []).map(function (id) { return load('experiences/' + id); })),
                load('home'), load('education'), load('beyond'), load('contact'),
                load('resume').catch(function () { return null; })   // optional: the PRINT screen
            ]).then(function (r) {
                return { site: s, projects: r[0], experience: r[1], home: r[2], education: r[3], beyond: r[4], contact: r[5], resume: r[6] };
            });
        });
    };
})();
