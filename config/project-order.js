/**
 * Project order and metadata.
 * Edit this file to control:
 *   - featured: order of the 3 projects on the home page
 *   - all: order of projects on the Projects page
 */

const PROJECT_ORDER = {
  /** First 3 projects shown in "Featured Projects" on the home page. */
  featured: ['ring-vco', 'telematic-pipe-building-robot', 'gcd-module'],
  /** Order of all projects on the Projects page. */
  all: ['ring-vco', 'telematic-pipe-building-robot', 'gcd-module', 'ai-synth', 'od-pedal'],
};

const PROJECTS = {
  'ring-vco': {
    title: 'Ring VCO Design + Layout in Cadence Virtuoso',
    shortTitle: 'Ring VCO Design + Layout',
    category: 'Analog IC Design',
    synopsis: 'Designed an analog ring oscillator in Cadence Virtuoso, focusing on layout for mixed-signal applications and clock generation.',
    image: 'ring-vco.jpg',
    href: 'ring-vco.html',
  },
  'ai-synth': {
    title: 'AI Powered Virtual Synthesizer',
    shortTitle: 'AI Powered Virtual Synthesizer',
    category: 'Audio / Machine Learning',
    synopsis: 'Developed a virtual synthesizer with integrated AI-powered preset generation for real-time music synthesis and sound exploration.',
    image: 'ai-synth.jpg',
    href: 'ai-synth.html',
  },
  'od-pedal': {
    title: 'JHS Morning Glory Copycat Pedal',
    shortTitle: 'Overdrive Guitar Pedal',
    category: 'Hardware / PCB Design',
    synopsis: 'Designing and fabricating a guitar overdrive pedal based on the JHS Morning Glory circuit, including PCB design, assembly, and custom housing.',
    image: 'od-pedal.jpg',
    href: 'od-pedal.html',
  },
  'gcd-module': {
    title: 'GCD Module ASIC Design',
    shortTitle: 'GCD Module ASIC Design',
    category: 'ASIC Design',
    synopsis: 'I was tasked with developing a module to calculate the greatest common denominator of two integers using the Euclidean algorithm.',
    image: 'verdi coverage onboarding.png',
    href: 'gcd-module.html',
  },
  'telematic-pipe-building-robot': {
    title: 'Telematic Pipe Building Robot',
    shortTitle: 'Telematic Pipe Building Robot',
    category: 'Robotics',
    synopsis: 'A telematic robot system for remote pipe building and assembly.',
    image: 'robotech thumb.jpg',
    href: 'telematic-pipe-building-robot.html',
  },
};
