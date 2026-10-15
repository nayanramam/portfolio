# Editing the site

Everything the oscilloscope shows comes from the markdown files in this folder. You never need to
touch `index.html` or anything in `assets/scope/`.

Each file has two parts:

```
---
title: Something          ← front matter (YAML): the structured bits
tags: [a, b, c]
---

## Normal markdown         ← body: free-form text, shown as written
```

## Which file is which

| File | Screen |
|---|---|
| `site.md` | Your name, the nameplate, the resume PDF, and the **order** of projects, experience files and timeline rows |
| `home.md` | HOME (X-Y): tagline lines, photo, bio (the body) |
| `projects/<name>.md` | One CH1 capture each. The body is the full write-up shown on the project's page |
| `experiences/<name>.md` | One organization each, with its roles on the CH2 timeline. The body is the "Full write-up" |
| `education.md` | CH3: school, measurements, coursework, skills |
| `beyond.md` | CH4: cubing records + videos, cooking dishes. The body is the line at the bottom |
| `contact.md` | PROBE OUT: the links typed by the beam. The body is the intro line |

## Common tasks

**Add a project:** copy an existing file in `projects/`, rename it (e.g. `pll.md`), edit it, then add
`pll` to the `projects:` list in `site.md`. The list order is the display order.

**Remove a project:** delete its name from `projects:` in `site.md` (the file can stay).

**Add a role at an existing organization:** add another item under `roles:` in that file.

**Add a new organization:** copy a file in `experiences/`, edit it, and add its name to
`experience:` in `site.md`. Its `trace:` picks the timeline row; add the row name to `traces:` in
`site.md` to control where it sits (otherwise it goes at the bottom).

**Change your resume:** put the PDF in `assets/` and update `resume:` in `site.md`.

**Images:** put them in `assets/...` and write paths from the site root, e.g.
`![Layout](assets/projects/ring-vco.png)`. Spaces in file names work in front matter; in markdown
image links write them as `%20`.

**Videos:** in front matter use the YouTube id (the part after `v=` or `youtu.be/`). In a write-up
body, paste this and change the id:

```html
<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" allowfullscreen loading="lazy"></iframe></div>
```

**Link between write-ups:** `[Ring VCO](#projects/ring-vco)` or
`[ICE Lab](#experience/ice-lab/write-up)`.

## Field reference

### Project (`projects/*.md`)

| Field | What it does |
|---|---|
| `title` | Name on the card and page |
| `tag` | Small label in the card's corner (e.g. `ANALOG IC`) |
| `category` | Line under the title on the project page |
| `wave` | Waveform drawn on the card: `square`, `complex`, `pulses`, `pwm`, `bitline` |
| `hint` | One-line teaser on the card |
| `image`, `image_alt` | Picture beside the summary (optional) |
| `summary` | The short paragraph at the top of the project page |
| `measurements` | `Label: value` rows shown as scope readouts |
| `links` | Extra buttons: a list of `label` + `url` |
| `video` | `youtube:` id and `title:` for the ▶ Video button (optional) |

### Experience (`experiences/*.md`)

| Field | What it does |
|---|---|
| `org` | Organization name |
| `trace` | Timeline row name (must match `traces:` in `site.md` to control its position) |
| `roles` | List of roles, each with the fields below |
| `links` | Extra buttons next to "Full write-up" (e.g. a paper PDF) |

Each role: `title`, `label` (printed on the pulse), `short` (used when the pulse is too narrow),
`start` and `end` as `YYYY-MM` (or `end: present`), `summary`, and `tags` as a list.

If the file has no body, the "Full write-up" button doesn't appear.

### Readouts

`home.md`, `education.md`, `beyond.md` and `contact.md` take
`readouts: [top-left, top-right, bottom-left, bottom-right]` for the small text in the screen
corners. Use `""` to leave a corner empty. CH1 and CH2 readouts are worked out automatically.

## YAML gotchas

- A value that starts with `#`, `&`, `*`, `[`, `{`, `>`, `|` or `@`, or that contains `: `
  (colon + space), needs quotes: `hint: "#1 overall"`.
- Indent with spaces, never tabs, and keep list items lined up.
- Numbers lose trailing zeros unless quoted: write `"40.10"`, not `40.10`.

If something is wrong the screen shows **NO SIGNAL** with the file name, line and spot that
tripped it.

## Previewing locally

Browsers won't load these files from a page opened by double-clicking `index.html`. From the site
folder run:

```
python -m http.server
```

then open <http://localhost:8000>. Refresh to see edits.
