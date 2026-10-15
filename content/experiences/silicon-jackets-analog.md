---
org: Silicon Jackets · Georgia Tech’s chip design club
trace: SJ · AMS                    # which timeline row (see traces in site.md)
roles:
  - title: Analog mixed-signal team lead
    label: TEAM LEAD               # printed on the pulse
    short: LEAD                    # used when the pulse is too narrow for the label
    start: 2026-08
    end: present
    summary: >
      Leading the 20+ member AMS IC design team on a PLL, SRAM, standard cells and SerDes;
      architecting co-simulation and PnR integration of analog blocks into the club’s digital
      tape-outs; running onboarding for 15+ new members with video lectures and weekly help sessions.
    tags: [virtuoso, pll, sram, serdes, leadership]
  - title: Analog mixed-signal design engineer
    label: DESIGN ENGINEER
    short: DESIGN ENG.
    start: 2025-10
    end: 2026-05
    summary: >
      Ring VCO (500 MHz, <250 ps rise/fall, <35 µW), then an 8-bit R-2R DAC, a single-stage amplifier
      and a digital inverter — validated with transient, AC and Monte-Carlo simulation and tuned for
      PVT variation through sizing.
    tags: [virtuoso, layout, monte-carlo]
---

## About

Silicon Jackets is Georgia Tech's chip design club. The club has digital design, design verification, and physical design teams that work together closely on the main tapeouts, and an analog mixed-signal (AMS) sub-team that was added more recently.

## Team Lead
*August 2026 – Present*

- Leading the 20+ member analog mixed-signal IC design team, coordinating project ownership and design reviews to develop a PLL, SRAM, standard cells, and SerDes
- Architecting co-simulation and PnR integration for analog and mixed-signal blocks in Silicon Jackets' digital tapeouts, for custom memory, clock generation, etc.
- Running technical onboarding for 15+ new members: producing video lectures and hosting weekly help sessions

## Design Engineer
*October 2025 – May 2026*

I started with an onboarding project to learn Cadence and the design process: [Ring VCO Project](#projects/ring-vco). I engineered the schematic, testbench, simulations (DC/AC/transient), and layout for a ring oscillator and buffer in Cadence Virtuoso, achieving 500 MHz oscillation, <250 ps rise and fall time, and <35 µW average power draw.

I then moved on to designing an 8-bit R-2R DAC, a single stage amplifier, and a digital inverter, validated with transient, AC, and Monte-Carlo simulation, optimizing for PVT variation through sizing and tuning.

## Tools Used
- Cadence Virtuoso (Schematic Editor, Layout Editor)
- Cadence Maestro / ADE
- Spectre Circuit Simulator
- Cadence Pegasus

## Skills Demonstrated
- Analog IC design fundamentals
- MOSFET physics and modeling
- Schematic design and simulation
- Custom layout techniques
- Design verification (DRC/LVS)
- Monte-Carlo and PVT analysis
- Technical leadership and design reviews
