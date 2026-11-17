---
title: Ring VCO design + layout
tag: ANALOG IC                     # small label on the capture card
category: Analog IC design
wave: square                       # waveform drawn on the card (see content/README.md)
hint: 500 MHz · <35 µW · Sky130    # one-line teaser on the card
thumb: assets/proj_thumbs/ring-vco.png    # picture on the CH1 card (replaces the waveform)
thumb_position: left                    # which part of the picture the card crop keeps (left, right, top, bottom, center)
thumb_zoom: 1.25                        # zoom in toward thumb_position (1 = no zoom)
banner: assets/proj_thumbs/ring-vco.png   # replaces the waveform at the top of the page
image_alt: Ring VCO layout in Cadence Virtuoso
summary: >
  A current-starved ring-oscillator VCO in Cadence Virtuoso on the Sky130 PDK, the onboarding
  project for SiliconJackets’ analog mixed-signal team. I sized the starving transistors from the
  required starve current, verified across ff/tt/ss corners and 0–70°C, designed an inverter buffer
  to drive a 1 pF load, and iterated the layout until it passed DRC and LVS.
measurements:
  Tool: Cadence Virtuoso · Maestro · Pegasus
  PDK: Sky130
  f osc: 500 MHz
  tr / tf: < 250 ps
  P avg: < 35 µW
  Corners: ff · tt · ss, 0–70 °C
  Load: 1 pF via buffer
  Signoff: DRC + LVS clean
links:
  - label: Design review (PDF)
    url: assets/projects/Nayan Ramam AMS Onboarding Design Review-5.pdf
---

## About

SiliconJackets is Georgia Tech's chip design club. The onboarding project for their analog mixed-signal sub-team was to create a ring oscillator that meets the following spec:

| Specification | Value |
|---------------|-------|
| Frequency Range | 450-550 MHz |
| Power Consumption | < 1 mW (oscillator module only) |
| Load Capacitance | 1 pF (with buffer) |
| Process Corners | ff, tt, ss |
| Temperature Range | 0-70°C |
| Supply Voltage | Sky130 PDK standard |

Typical ring oscillators use inverters chained together, where increasing the number of inverters changes the frequency. I opted for a design using current-starved inverters, which cascode an extra PFET and NFET onto a standard inverter. These additional transistors (which I refer to as the "starving" transistors) can be used to limit the slew rate of the inverter, thus allowing for tunable oscillation frequency.

I sourced the specific design from a 2016 paper by Suman et al. I used it to build a schematic in Cadence Virtuoso with the Sky130 PDK.

![AMS VCO Schematic](assets/AMS%20VCO%20Schem.png)

I then calculated the required starve current and by proxy the W/L ratios to size the starving transistors based on my desired frequency of oscillation (500 MHz). The calculations can be seen in the design review linked above.

I simulated over the ff, tt and ss corners, did a temperature sweep from 0-70 C, and checked frequency and power draw under all conditions. For this project, I only needed to meet spec across the temparature range, not PVT corners. I also designed a buffer that allowed the VCO to drive 1 pF of load capacitance. The buffer is simply a cascode of inverters, with each inverter doubling in width to increase the load it can drive.

After simulating my schematic, I moved on to layout. I went through several design iterations, both to avoid spacing issues and to optimize the footprint. Eventually, after several iteration, I passed DRC and LVS. The final layout is below:

![Layout](assets/proj_thumbs/ring-vco.png)

The final portion of the project was to create a design review slideshow documenting the design process, schematics, simulation results, and layout: [Design Review Slides](assets/projects/Nayan%20Ramam%20AMS%20Onboarding%20Design%20Review-5.pdf).

## Skills Demonstrated
- Analog IC design fundamentals
- Custom layout techniques
- Design verification (DRC/LVS)
- Corner and temperature analysis
- Buffer design for load driving
- Design iteration and optimization

## Tools Used
- Cadence Virtuoso
- Cadence Pegasus
- Cadence Maestro
- Sky130 PDK
