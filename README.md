# Nayan Ramam · portfolio

The site is a vintage analog oscilloscope (`index.html`). All of its content lives in markdown in
[`content/`](content/) — see [`content/README.md`](content/README.md) for how to edit it.

- `content/` — everything the site says (markdown + YAML front matter)
- `assets/` — images, PDFs, and the scope itself (`assets/scope/`: styles, drawing, and the
  markdown loader)
- `acronymdb/` — separate acronym lookup tool

Preview locally with `python -m http.server` and open <http://localhost:8000>.

Older versions of the site live on other branches: `legacy_plain` (the original plain site) and
`legacy_notebook` (the notebook-style site).
