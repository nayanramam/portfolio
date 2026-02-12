/**
 * Experience order for the home page.
 * Edit this file to control the order of experience cards in the "Experience" section on the home page.
 */

const EXPERIENCE_ORDER = {
  /** Order of experience cards on the home page. List IDs in the order you want them to appear. */
  featured: ['ice-lab', 'silicon-jackets', 'interactive-music-group', 'math-modeling', 'iva-lab', 'sjsu'],
};

const EXPERIENCES = {
  'ice-lab': {
    title: 'Analog Design Researcher',
    date: 'Oct 2025 - Present',
    subtitle: 'Integrated Computational Electronics Lab',
    image: 'ice lab thumb.png',
    href: 'ice-lab.html',
  },
  'iva-lab': {
    title: 'Image Processing & AI/ML Researcher',
    date: 'Aug 2025 - Feb 2026',
    subtitle: 'Intelligent Vision Automation Lab',
    image: 'iva lab thumb.png',
    href: 'iva-lab.html',
  },
  'sjsu': {
    title: 'Digital Design Researcher',
    date: 'May 2025 - Aug 2025',
    subtitle: 'San José State University',
    image: 'sjsu thumb.png',
    href: 'sjsu.html',
  },
  'math-modeling': {
    title: 'Team Lead & Researcher',
    date: 'Aug 2024 - Present',
    subtitle: 'Math Modeling Research Group',
    image: 'math modeling thumb.png',
    href: 'math-modeling.html',
  },
  'interactive-music-group': {
    title: 'Project Manager',
    date: 'Aug 2025 - Present',
    subtitle: 'Interactive Music Group',
    image: 'interactive music group thumb.png',
    href: 'interactive-music-group.html',
  },
  'silicon-jackets': {
    title: 'Digital & Analog Mixed-Signal Design',
    date: 'Jan 2025 - Present',
    subtitle: 'Silicon Jackets',
    image: 'sj tapeout.jpg',
    href: 'silicon-jackets.html',
  },
};
