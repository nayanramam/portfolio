# Config: project and experience order

## Projects

Edit **`project-order.js`** to control how projects appear:

- **`PROJECT_ORDER.featured`** — Array of 3 project IDs shown in “Featured Projects” on the **home page** (in this order).
- **`PROJECT_ORDER.all`** — Array of all project IDs in the order they appear on the **Projects** page.

Project IDs must match the keys in `PROJECTS` (e.g. `ring-vco`, `ai-synth`, `od-pedal`, `gcd-module`, `telematic-pipe-building-robot`). To add a new project, add an entry to `PROJECTS` and include its ID in `PROJECT_ORDER.all` (and optionally in `PROJECT_ORDER.featured`).

## Experiences (home page only)

Edit **`experience-order.js`** to control the order of experience cards in the “Experience” section on the **home page**. The experiences index page (`experiences/index.html`) is unchanged.

- **`EXPERIENCE_ORDER.featured`** — Array of experience IDs in the order they appear on the home page (e.g. `ice-lab`, `iva-lab`, `sjsu`, `math-modeling`, `interactive-music-group`, `silicon-jackets`). Reorder or omit IDs to change what appears.
- **`EXPERIENCES`** — Metadata for each experience (title, date, subtitle, image, href). Add new entries here and include their ID in `EXPERIENCE_ORDER.featured` to show them on the home page.
