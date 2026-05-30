# Digital & Analog Mixed-Signal Design | Silicon Jackets

## About

Silicon Jackets is Georgia Tech's chip design club. We are currently nearing our second tapeout of a 32-bit RISC-V CPU. The club has digital design, design verification, and physical design teams that work together closely for the main tapeouts. Last semester an analog mixed-signal (AMS) sub-team was added.

## Analog Mixed-Signal Design

I started with an onboarding project to learn Cadence and the design process: [Ring VCO Project](../../projects/ring-vco.html).

I then moved on to designing an 8-bit R-2R DAC. I performed transient and AC simulations to verify ideal behavior, and am now developing the buffer and optimizing for PVT variation through Monte-Carlo simulation and sizing/tuning.

At the end of the Spring semester, I was selected to be the sub-team lead, a role I will take on the Fall.


## Digital Design

My first semester on the digital design team was spent doing an onboarding project. See the details [here](../../projects/gcd-module.html).

Upon completion of the onboarding project, I began work on the digital design for the club's second tapeout. I developed a fast divider module, implementing three division algorithms in Python and performing constrained random verification to gauge cycle/iteration counts and variance. From there, I built a workplan with block diagrams, flowcharts, state machines, and a port list. I then moved to writing RTL, initially verifying with a simple "sanity check" test bench, then moved to a more comprehensive UVM environment where my focus shifted to verification and optimization.

I am now working on a CORDIC module for our third tapeout.

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

