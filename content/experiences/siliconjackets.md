---
org: SiliconJackets · Georgia Tech’s chip design club
trace: SJ · AMS                    # default timeline row (see traces in site.md); a role can set its own
roles:
  - title: Analog mixed-signal team lead
    label: TEAM LEAD               # printed on the pulse
    short: LEAD                    # used when the pulse is too narrow for the label
    tab: AMS Team Lead             # which tab of the write-up this role opens
    start: 2026-08
    end: present
    summary: >
      Leading the 60+ member AMS IC design team on a PLL, SRAM, standard cells and SerDes;
      architecting co-simulation and PnR integration of analog blocks into the club’s digital
      tape-outs; running onboarding for 45+ new members with video lectures and weekly help sessions.
    tags: [virtuoso, pll, sram, serdes, leadership]
  - title: Analog mixed-signal design engineer
    label: DESIGN ENGINEER
    short: DESIGN ENG.
    tab: AMS Design Engineer
    start: 2025-10
    end: 2026-05
    summary: >
      Ring VCO (500 MHz, <250 ps rise/fall, <35 µW), then an 8-bit R-2R DAC, a single-stage amplifier
      and a digital inverter, validated with transient, AC and Monte-Carlo simulation and tuned for
      PVT variation through sizing.
    tags: [virtuoso, layout, monte-carlo]
  - title: Digital design engineer
    label: DIGITAL DESIGN ENGINEER
    short: DIGITAL
    tab: Digital Design Engineer
    trace: SJ · DIG
    start: 2025-01
    end: 2026-05
    summary: >
      RTL, verification and P&R across three tape-outs: a GCD module, a fast divider for a 6-stage
      RISC-V core (UVM, constrained-random verification), and a pipelined CORDIC AXI peripheral.
    tags: [systemverilog, uvm, sta]
---

## About

SiliconJackets is Georgia Tech's chip design club. The club has digital design, design verification, and physical design teams that work together closely on the main tapeouts, and an analog mixed-signal (AMS) sub-team that was added more recently.

<!-- tabs: everything below is split into tabs, one per "## " heading -->

## AMS Team Lead

*August 2026 – Present*

### Onboarding

My first task as lead was onboarding 45+ new members. I guided them through an onboarding project, which was my [Ring VCO project](#projects/ring-vco) with a few small modifications. The group ranged from first-year undergrads who didn't know what a MOSFET was to PhD students with more knowledge than me, so I held weekly lectures that started with device physics and basic circuit analysis and built up to tutorials on simulation and layout in Cadence Virtuoso.

### Growing the Team

Before this wave of new members, we had around a dozen active members, so the team grew to 60+ in a few weeks. We're in our second full semester of operation, and I'm leading our first tapeout effort, targeting integration into SiliconJackets' Fall 2027 tapeout on SKY130. On top of our existing projects (SRAM, a PLL, and a bandgap reference), I coordinated the team taking on several new modules:

- Amplifiers: 5T, 9T and 11T OTAs, a folded cascode, and a two-stage Miller-compensated amp
- SerDes
- A 10-bit SAR ADC

### Real Number Modeling

I'm also starting to build behavioral models of our AMS blocks using SystemVerilog Real Number Modeling (RNM). RNM is vital to our verification effort, since we need to simulate our IP together with the digital core. Running SPICE on a CPU with several million transistors would be orders of magnitude too slow, so instead we characterize each AMS block in SPICE, then write a SystemVerilog model that matches its behavior as closely as possible using the `real` datatype (64-bit floating point). These models work with UVM but aren't synthesizable. They exist only to make sure the digital logic works correctly when it interfaces with our AMS designs.

Right now I'm building a library of RNM primitives (`real`-to-digital and digital-to-`real` conversion, a lowpass filter, a comparator, etc.) that I'll use to build more complex models later.

### SRAM Compiler

This one is much less fleshed out, since it isn't as high a priority right now. The goal is to mirror the functionality of SRAM22, which the digital teams currently use and which the analog team is working to replace in the club's next tapeout.

The main decision I'm working through is whether to design several bitcells sized for different speeds and area densities and have the compiler pick one based on the user's configuration, or to use one size that works across all specs. It mostly comes down to complexity and time. Using multiple sizes means characterizing and laying out unique versions of the bitcells and all the peripheral circuitry, plus an extra layer of complexity in the compiler. As of now, I'm leaning toward multiple sizes.

### Skills Demonstrated
- Technical leadership and design reviews
- Teaching and technical onboarding
- Project planning and coordination
- Behavioral modeling of analog/mixed-signal blocks
- Mixed-signal verification
- SRAM compiler architecture

### Tools Used
- Cadence Virtuoso (Schematic Editor, Layout Editor)
- SystemVerilog (Real Number Modeling)

## AMS Design Engineer

*October 2025 – May 2026*

I started with an onboarding project to learn Cadence and the design process: [Ring VCO Project](#projects/ring-vco). I engineered the schematic, testbench, simulations (DC/AC/transient), and layout for a ring oscillator and buffer in Cadence Virtuoso, achieving 500 MHz oscillation, <250 ps rise and fall time, and <35 µW average power draw.

I then moved on to designing an 8-bit R-2R DAC, validating with transient, AC, and Monte-Carlo simulation, optimizing for PVT variation through sizing and tuning.

### Skills Demonstrated
- Analog IC design fundamentals
- MOSFET physics and modeling
- Schematic design and simulation
- Custom layout techniques
- Design verification (DRC/LVS)
- Monte-Carlo and PVT analysis

### Tools Used
- Cadence Virtuoso (Schematic Editor, Layout Editor)
- Cadence Maestro / ADE
- Spectre Circuit Simulator
- Cadence Pegasus

## Digital Design Engineer

*January 2025 – May 2026*

### Tape-out 1

My first semester on the digital design team was spent doing an onboarding project. See the details [here](#projects/gcd-module). I designed a module to calculate the greatest common divisor of two numbers, working through design, testbench, synthesis, and STA.

### Tape-out 2

The club's second tapeout was a 6-stage RISC-V core with 32KB of DFFRAM on SkyWater 130nm.

I developed a fast divider module for the core, implementing three division algorithms in Python and performing constrained random verification to gauge cycle/iteration counts and variance. From there, I built a workplan with block diagrams, flowcharts, state machines, and a port list. I then moved to writing RTL, initially verifying with a simple "sanity check" test bench, then moved to a more comprehensive UVM environment with constrained random verification and directed testing, where my focus shifted to verification and optimization.

### Tape-out 3

Before becoming the [analog team lead](#tab/AMS%20Team%20Lead), I briefly started work on a CORDIC module. CORDIC is used to accelerate the computation of trigonometric functions and to perform vector rotation. It works iteratively, so pipelining it can vastly increase speed at the cost of area and power.

To figure out how many pipeline stages we needed, I started writing a behavioral model of the module in C. The goal was to estimate how many iterations it would take to reach our target precision, which would then drive the pipelining decision. I moved into the AMS lead role before finishing it.

### Skills Demonstrated
- SystemVerilog RTL design
- Testbench development (UVM)
- Constrained random verification
- Static timing analysis
- Fast division algorithms (Newton-Raphson, Goldschmidt)
- Hardware-efficient lookup table design
- Physical design and implementation

### Tools Used
- SystemVerilog
- Synopsys Verdi
- Cadence Innovus
- Python