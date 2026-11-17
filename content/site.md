---
# Site-wide settings. Everything between the two --- lines is YAML.
name: Nayan Ramam
nameplate: Nayan Ramam            # the little aluminum badge above the screen
resume: assets/resume.pdf

# CH1 · Projects — one file per project in content/projects/, listed in display order
projects:
  - ring-vco
  - sram
  - gcd-module
  - ai-synth
  - telematic-pipe-building-robot

# CH2 · Experience — one file per organization in content/experiences/ (any order;
# roles are sorted newest-first automatically)
experience:
  - siliconjackets
  - ice-lab
  - hpe
  # - sjsu                       # hidden from the site; the file is kept
  - interactive-music-group
  - iva-lab
  - math-modeling

# CH2 role cards under the timeline, in display order. Each is an experience file name;
# for a file with several roles add /N for its Nth role (siliconjackets/1 = the first role listed).
# Roles left out are added at the end, newest first.
cards:
  - siliconjackets/1               # AMS team lead
  - hpe
  - siliconjackets/3               # digital design engineer
  - ice-lab
  - siliconjackets/2               # AMS design engineer
  - math-modeling
  - interactive-music-group
  - iva-lab

# CH2 timeline rows, top to bottom. Each experience file names its row with `trace:`.
# A trace that isn't listed here is added at the bottom.
traces:
  - SJ · AMS
  - SJ · DIG
  - ICE LAB
  - SUMMER
  - IMG
  - IVA LAB
  - MATH MOD
---

This file only holds settings; nothing below the front matter is shown on the site.
See content/README.md for how every content file works.
