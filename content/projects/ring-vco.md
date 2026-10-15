---
title: Ring VCO design + layout
tag: ANALOG IC                     # small label on the capture card
category: Analog IC design
wave: square                       # waveform drawn on the card (see content/README.md)
hint: 500 MHz · <35 µW · Sky130    # one-line teaser on the card
image: assets/projects/ring-vco.png
image_alt: Ring VCO layout in Cadence Virtuoso
summary: >
  A current-starved ring-oscillator VCO in Cadence Virtuoso on the Sky130 PDK, the onboarding
  project for Silicon Jackets’ analog mixed-signal team. I sized the starving transistors from the
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

Silicon Jackets is Georgia Tech's chip design club. The onboarding project for their recently created analog mixed-signal sub-team was to create a ring oscillator that meets the following spec:

| Specification | Value |
|---------------|-------|
| Frequency Range | 450-550 MHz |
| Power Consumption | < 1 mW (oscillator module only) |
| Load Capacitance | 1 pF (with buffer) |
| Process Corners | ff, tt, ss |
| Temperature Range | 0-70°C |
| Supply Voltage | Sky130 PDK standard |

Typical ring oscillators use inverters chained together, where increasing the number of inverters changes the frequency. I opted for a design using current-starved inverters, since the starving inverters allow control over oscillation frequency based on their sizing and they can be tied to an input voltage that allows for voltage based frequency control. This allows for fewer inverter stages to achieve the same frequencies as a typical ring oscillator.

I sourced the specific design from a 2016 paper by Suman et al. I used it to build a schematic in Cadence Virtuoso with the Sky130 PDK.

![AMS VCO Schematic](assets/AMS%20VCO%20Schem.png)

I then calculated the required starve current and by proxy the W/L ratios to size the starving transistors based on my desired frequency of oscillation (500 MHz). The calculation can be seen in the design review linked above.

I simulated over the ff, tt and ss corners, did a temperature sweep from 0-70 C, and checked frequency and power draw under all conditions, ensuring my module met the spec. I also designed a buffer that allowed the VCO to drive 1 pF of load capacitance while meeting the power spec. The oscillator module itself remained well under 1 mW of power draw, but with only three inverting stages and transistors of the sizes that enable the module to meet the frequency spec, it is unable to drive the required capacitance. The buffer remedies this. It works simply by inverting the signal an even number of times, with each inverter sized larger and larger to increase the load it can drive.

After simulating my schematic, I moved on to the layout phase of the project. I went through several design iterations, both to avoid spacing issues and to optimize the footprint. Eventually, after several iteration, I passed DRC and LVS. The final layout is below:

![Layout](assets/projects/ring-vco.png)

The final portion of the project was to create a design review slideshow documenting the design process, schematics, simulation results, and layout: [Design Review Slides](assets/projects/Nayan%20Ramam%20AMS%20Onboarding%20Design%20Review-5.pdf).

## Tools Used
- Cadence Virtuoso
- Cadence Pegasus
- Cadence Maestro
- Sky130 PDK

## Skills Demonstrated
- Analog IC design fundamentals
- Custom layout techniques
- Design verification (DRC/LVS)
- Corner and temperature analysis
- Buffer design for load driving
- Design iteration and optimization
