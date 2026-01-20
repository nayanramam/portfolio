# Digital & Analog Mixed-Signal Design | Silicon Jackets

## About

Silicon Jackets is Georgia Tech's chip design club. We are currently nearing our second tapeout of a 32-bit RISC-V CPU. The club has digital design, design verification, and physical design teams that work together closely for the main tapeouts. Last semester an analog mixed-signal (AMS) sub-team was added.

## Analog Mixed-Signal Design

Most of my time on the team was spent working on the [Ring VCO Project](../../projects/ring-vco.html).

The team also hosted weekly lectures covering fundamental analog concepts, since many of us (myself included) had no prior experience. We learned basic MOSFET physics and behaviors, outlining second order effects and small signal models. We also learned how to use Cadence Virtuoso through the construction of digital inverter and single-stage amplifier modules. We covered schematic design, basic simulation, and layout practices. These lectures culminated in the aforementioned ring VCO project.

Now, as I await a module assignment, I am solidifying my foundational knowledge with Dr. Aaron Lanterman's <a href="https://www.youtube.com/playlist?list=PLOunECWxELQSbOv3ekzuwC4K8ygV-Jkiy" target="_blank" rel="noopener noreferrer">Analog Electronics Lecture Series</a>.


## Digital Design

My first semester on the digital design team was spent doing an onboarding project. See the details [here](../../projects/gcd-module.html).

Upon completion of the onboarding project, I began work on the digital design for the club's second tapeout. I am developing a fast divider module. I started by implementing three division algorithms in Python and performed constrained random verification to gauge cycle/iteration counts and variance. I quickly narrowed it down to Newton-Raphson and Goldschmidt. From there, I built a workplan with block diagrams, flowcharts, state machines, and a port list. The team leads stressed the importance of thorough documentation prior to writing RTL to allow the design verification team to develop the testbench in parallel.

Currently, I am developing the first iteration of RTL for each algorithm. I have implemented two hardware speed-ups: shifting when the divisor is a multiple of two and skipping the division logic when either input is zero. The module can handle negative inputs and returns either the quotient or remainder, covering the div, divu, rem, and remu RISC-V instructions.

## Tools Used
- Cadence Virtuoso (Schematic Editor, Layout Editor)
- Spectre Circuit Simulator
- SystemVerilog
- Verdi

## Skills Demonstrated
- Analog IC design fundamentals
- MOSFET physics and modeling
- Schematic design and simulation
- Custom layout techniques
- Design verification (DRC/LVS)
- SystemVerilog RTL design
- Testbench development
- Constrained random verification
- Fast division algorithms (Newton-Raphson, Goldschmidt)
- Hardware-efficient lookup table design
- Physical design and implementation

## Resources
*[Add relevant documentation, design reviews, or resources here]*

