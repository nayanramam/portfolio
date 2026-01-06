# Nayan Ramam Portfolio Site

A minimal, elegant portfolio website built with HTML and Tailwind CSS.

## Structure

```
portfolio_site/
├── index.html              # Home page
├── experience.html         # Full experience page
├── projects/
│   ├── index.html          # All projects listing
│   ├── ring-vco.html       # Ring VCO project detail
│   └── ai-synth.html       # AI Synth project detail
├── content/                # Markdown content files
│   ├── profile.md
│   ├── experience.md
│   ├── skills.md
│   ├── education.md
│   └── projects/
│       ├── ring-vco.md
│       └── ai-synth.md
├── assets/
│   ├── profile.jpg         # Your profile photo
│   ├── cv.pdf              # Your CV/resume
│   └── projects/
│       ├── ring-vco.jpg    # Ring VCO project image
│       └── ai-synth.jpg    # AI Synth project image
└── reference/              # Design reference files
```

## Setup

1. **Add your images:**
   - Add your profile photo as `assets/profile.jpg`
   - Add project images to `assets/projects/`
   - Add your CV as `assets/cv.pdf`

2. **Customize content:**
   - Edit the markdown files in `content/` folder
   - The project pages will load content from markdown files dynamically

3. **Run locally:**
   - For markdown loading to work, you need a local server
   - Use VS Code Live Server, Python's http.server, or similar:
   
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or with Node.js
   npx serve
   ```

4. **Deploy:**
   - Upload to any static hosting (GitHub Pages, Netlify, Vercel, etc.)

## Features

- Clean, minimal design matching the reference
- Warm cream color palette
- Responsive layout with Tailwind CSS
- Markdown content support via marked.js
- Project detail pages with navigation
- Experience timeline page

## Customization

### Colors
Edit the Tailwind config in each HTML file:
- `cream`: Main background color
- `cream-dark`: Darker accent
- `ink`: Primary text
- `olive`: Accent/highlight color

### Fonts
- **Libre Baskerville**: Headings (serif)
- **DM Sans**: Body text (sans-serif)  
- **JetBrains Mono**: Labels and UI elements (monospace)

## Adding New Projects

1. Create a new markdown file in `content/projects/`
2. Duplicate an existing project HTML file in `projects/`
3. Update the fetch path in the new HTML file
4. Add the project to `projects/index.html` and `index.html`

