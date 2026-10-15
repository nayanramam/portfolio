---
org: Silicon Jackets · Georgia Tech’s chip design club
trace: SJ · DIG
roles:
  - title: Digital design engineer
    label: DIGITAL DESIGN ENGINEER
    short: DIGITAL
    start: 2025-01
    end: present
    summary: >
      RTL, verification and P&R across three tape-outs: a GCD module, a fast divider for a 6-stage
      RISC-V core (UVM, constrained-random verification), and a pipelined CORDIC AXI peripheral.
    tags: [systemverilog, uvm, sta]
---

## About

Silicon Jackets is Georgia Tech's chip design club. The club has digital design, design verification, and physical design teams that work together closely on the main tapeouts. I joined the digital design team in January 2025 and have worked on three tapeouts so far.

## Tape-out 1

My first semester on the digital design team was spent doing an onboarding project. See the details [here](#projects/gcd-module).

- Designed a SystemVerilog module through the full stack (RTL, testbench, static timing analysis, P&R) to calculate the greatest common divisor using the Euclidean algorithm (99.62% DUT coverage)
- Programmed a Python script to parse STA reports and identify setup/hold violations

## Tape-out 2

The club's second tapeout was a 6-stage RISC-V core with 32KB of DFFRAM on SkyWater 130nm.

I developed a fast divider module for the core, implementing three division algorithms in Python and performing constrained random verification to gauge cycle/iteration counts and variance. From there, I built a workplan with block diagrams, flowcharts, state machines, and a port list. I then moved to writing RTL, initially verifying with a simple "sanity check" test bench, then moved to a more comprehensive UVM environment with constrained random verification and directed testing, where my focus shifted to verification and optimization.

## Tape-out 3

- Building and verifying a pipelined CORDIC AXI peripheral
- Performing bit-level C simulation to drive architectural design choices

## Tools Used
- SystemVerilog
- Verdi
- Cadence Innovus
- Python

## Skills Demonstrated
- SystemVerilog RTL design
- Testbench development (UVM)
- Constrained random verification
- Static timing analysis
- Fast division algorithms (Newton-Raphson, Goldschmidt)
- Hardware-efficient lookup table design
- Physical design and implementation
