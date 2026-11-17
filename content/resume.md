---
# PRINT · RESUME. The resume as text on the scope screen; the Download button at the top gets
# the PDF set by `resume:` in site.md. Keep this in step with the PDF when you update it.
heading: Print · Resume
contact: Campbell, CA · [nramam3@gatech.edu](mailto:nramam3@gatech.edu) · U.S. Citizen · [LinkedIn](https://www.linkedin.com/in/nramam/)
readouts: [PRINT  RESUME, "", "", STORED]
---

<!--
A heading with " | " puts what follows on the right, like the dates on the PDF:
### Organization · Role | May 2026 – August 2026
Use ### for an entry and #### for a role inside it.
-->

## Education

### Georgia Institute of Technology · Atlanta, GA | August 2024 – Present

B.S. in Electrical Engineering, GPA 3.91, Eta Kappa Nu (IEEE-HKN) Honor Society. Expected graduation December 2027.

Relevant coursework: Analog IC Design, Analog Electronics, Microelectronics, Signals & Systems, Digital Design Lab, DSP

## Experience

### Hewlett Packard Enterprise · ASIC Verification/Design Intern | May 2026 – August 2026

- Architected agentic AI framework to generate, verify, and debug 115+ post-silicon tests (4000+ engineer-hours saved)
- Root-caused defects in packet-modeling engine and scoreboards to resolve issues across L2/L3, LAG, ECMP, and 15+ others, unblocking migration to next-gen testing environment
- Streamlined infrastructure around AI agents to automate regressions, triage test logs, and generate test documentation

### SiliconJackets | January 2025 – Present

#### Analog Mixed-Signal Design Team Lead | August 2026 – Present

- Leading 60+ member analog mixed-signal IC design team, coordinating project ownership and design reviews to develop PLL, SRAM, standard cells, and SerDes, targeting integration into SiliconJackets' Fall 2027 tape-out on SKY130
- Driving co-simulation/mixed-signal verification flow using Verilog-AMS and SystemVerilog Real Number Modeling
- Ran technical onboarding for 45+ new members, produced video lectures, hosted weekly help sessions

#### Analog Mixed-Signal Design Engineer | October 2025 – May 2026

- Engineered schematic/testbench/simulation/layout (DC/AC/transient) for ring oscillator + buffer using Cadence Virtuoso, achieving 500 MHz oscillation, sub-250 ps rise and fall time, sub-35 µW avg. power draw
- Designed 8-bit R-2R DAC, single-stage amplifier, and digital inverter, validated with transient/AC/Monte Carlo simulation

#### Digital Design Engineer | January 2025 – May 2026

**Tape-out 1**

- Delivered SystemVerilog module through full flow (RTL, testbench, static timing analysis, P&R) to calculate greatest common divisor using the Euclidean algorithm (99.62% DUT coverage)
- Programmed Python script to parse STA reports and identify setup/hold violations

**Tape-out 2**

- Achieved tape-out of 6-stage RISC-V core with 32KB of DFFRAM on SKY130
- Developed block diagrams, state machines, Python code, and RTL for a fast divider module on RISC-V core
- Verified divider via UVM testbench with constrained-random verification and directed testing

### Math Modeling Student Research Group · Team Lead | August 2024 – April 2026

- Led student research team creating a quantitative framework for characterizing feature overlap in neural networks
- Constructed Python pipeline to generate and embed feature visualizations via gradient ascent (PyTorch, NumPy)
- Published first-author findings in The Tower, Georgia Tech's peer-reviewed undergraduate research journal

## Projects

### CMOS Operational Transconductance Amplifier (OTA) on GF180 | October 2026

- Designed 11-transistor OTA with wide-swing cascode output on GF180 using gm/ID sizing, achieving 83.3 dB gain, 53.1 MHz UGF, 56.9° phase margin into 1 pF at 322 µW
- Created full-custom layout in Magic through DRC/LVS signoff, performed parasitic extraction (PEX) and post-layout simulation to compensate bandwidth loss from layout parasitics
- Characterized post-layout performance with ngspice AC/DC/transient testbenches, confirming 0.4–2.9 V ICMR and output swing on a 3.3 V supply with on-chip bootstrap current reference bias

### AI Inference SoC With Custom SRAM | June 2026 – Present

- Leading team of 6 building a RISC-V CPU with a systolic array and custom SRAM
- Designing dual-port 2KB SRAM macros using modified 6T bit cell for single cycle read/write
- Building sense amps, address decoders, and write drivers, verifying read/write at 200 MHz through transient simulation

## Skills

- **Programming languages:** SystemVerilog, Verilog, VHDL, Python, Assembly, C
- **Software/platforms:** Cadence Virtuoso/ADE/Spectre/Pegasus, SPICE, KiCad, Linux, Quartus, Git
- **Hardware:** Oscilloscope, Multimeter, Function Generator, Field-Programmable Analog Array (FPAA), FPGA
- **Communication:** Technical Reports, Design Reviews, Technical Presentations
