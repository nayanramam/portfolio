---
org: Integrated Computational Electronics (ICE) Lab
trace: ICE LAB
roles:
  - title: Undergraduate researcher
    label: UNDERGRAD RESEARCHER
    short: RESEARCHER
    start: 2025-10
    end: 2026-05
    summary: >
      Building an audio synthesis and signal-processing circuit library on a field-programmable
      analog array (FPAA); designing a new FPAA on the GF180 PDK.
    tags: [fpaa, gf180, xschem, ngspice, magic]
links:                             # extra buttons next to the write-up button
  - label: Report (PDF)
    url: assets/experiences/ICE_Lab_Audio_Subgroup_Spring_2026-1.pdf
---

## About

Paraphrasing the website, the ICE Lab focuses on configurable electronics/circuits and neuromorphic engineering. The team I was on developed a toolchain for programming circuits on Field Programmable Analog Arrays (FPAAs). At the bottom of this page I linked some resources explaining most of the concepts, but here is a TLDR:

## Key Terms
- **FPAA:** The analog counterpart to an FPGA. They are comprised of tiles of essential circuit elements (OTAs, caps, etc.) called Computational Analog Blocks (CABs) and digital Computational Logic Blocks (CLBs). Parameters and routing configurations are stored using floating gate transistors.
- **Floating Gate (FG) Transistor:** A MOSFET with an electrically isolated (i.e. "floating") gate that controls the threshold voltage based on the amount of charge stored in that gate.
- **Current-Starved Inverter:** A standard CMOS inverter with extra transistors that limit the current available to the inverting transistors (i.e. starving the current). This slows the rise and fall times, making the delay more controllable.

## Objective
FPAAs are used far less than FPGAs, so the software for programming them is much more primitive than something like Vivado or Quartus, and the lab is working toward making analog circuits as easy to reconfigure on an FPAA as RTL is on an FPGA. I was in the audio subgroup, building and testing a library of audio synthesis and signal-processing circuits on the FPAA.

## My Project
The lab has built a tool called RASP30, which allows for graphical circuit design using a custom Scilab Xcos library and compiler, as well as a pipeline centered around a custom Python-based HDL. I worked with a partner to build some of the core building blocks of audio synthesis on an FPAA, then tested and tuned each one by sweeping its bias voltages. Everything is detailed in this [report](assets/experiences/ICE_Lab_Audio_Subgroup_Spring_2026-1.pdf), but here is the short version.

## Current-Starved Inverter
The ADSR and VCO are both built on this circuit. With a 1 kHz, 0-2 V square wave in and the PMOS bias fixed at 1 V, we swept the NMOS bias from 800 mV to 1.8 V. As the bias went up, the stronger pull-down gave a cleaner inverted square wave. In the plots below (low bias first, then high bias), orange is the input and blue is the output.

![Current-starved inverter output at low NMOS bias: the output ramps down slowly](assets/experiences/icelab/csi_result_low_vbn.png) ![Current-starved inverter output at high NMOS bias: a clean inverted square wave](assets/experiences/icelab/csi_result_high_vbn.png)

## ADSR Envelope Generator
We added a control NMOS to the current-starved inverter and drove the PMOS bias with a shaped square wave instead of a fixed voltage. When that bias jumps at the start of each cycle, the pull-up current spikes and the output rises quickly (the attack), then it falls off into the slower decay and sustain as the bias settles.

![ADSR envelope generator schematic: a current-starved inverter with an added control NMOS](assets/experiences/icelab/adsr_schematic.png) ![Measured ADSR output: a sharp attack spike, a sustain level, then release](assets/experiences/icelab/adsr_result.png)

## Voltage-Controlled Oscillator
A ring of current-starved inverter stages, with a single bias node (Vn) setting the current through every stage. Less current means a slower stage, which means a lower frequency. Raising Vn from 700 mV to 1 V took the output from about 208 Hz to about 4 kHz.

![VCO output with Vn at 700 mV](assets/experiences/icelab/vco_result_700mV.png) ![VCO output with Vn at 1 V, oscillating much faster](assets/experiences/icelab/vco_result_1V.png)

## Gilbert Multiplier
Two stacked differential pairs that multiply their inputs. With both inputs at 200 mV and 5 kHz, the output clipped, and bumping both up to 500 mV smoothed it out. Feeding it 1 kHz and 5 kHz gave amplitude modulation, with components at 4 kHz and 6 kHz as expected. In the plot, orange is the 5 kHz input and blue is the output.

![Gilbert multiplier output with 1 kHz and 5 kHz inputs, showing amplitude modulation](assets/experiences/icelab/gilbert_case3_result.png)

Two inputs at the same frequency should double the frequency, but DC offsets and bias imbalance left a strong fundamental, so we didn't see it clearly.

The next steps we laid out were testing with direct audio in/out through the PCB's audio ports, tuning the Gilbert multiplier's biasing to get clear frequency doubling, extending the VCO to generate multiple waveforms, and building more circuits: voltage-controlled filters and amplifiers, relaxation oscillators, tremolo, waveshaping, and distortion.

## Skills Demonstrated
- Analog circuit design
- Floating-gate circuit design
- FPAA programming and configuration

## Tools Used
- RASP30 Toolchain
- Scilab Xcos
- FPAA (Field-Programmable Analog Array)

## Resources
- [Spring 2026 audio subgroup report (PDF)](assets/experiences/ICE_Lab_Audio_Subgroup_Spring_2026-1.pdf)
- [Dr. Jennifer Hasler's website](https://hasler.ece.gatech.edu/)
- [Dr. Aaron Lanterman's YouTube videos](https://youtube.com/playlist?list=PLOunECWxELQTCZEqIbHZpRmIEeQR80o3j&si=GwBfZx7P912TELFq)
- [FPAA Review/Overview](https://hasler.ece.gatech.edu/FPAA_IEEEXPlore_2020.pdf)
- [RASP30](https://hasler.ece.gatech.edu/SoCFPAA/Highlevel_tools_jlpea_February2016.pdf)
- [Floating Gate MOS](https://ieeexplore.ieee.org/document/913180)
