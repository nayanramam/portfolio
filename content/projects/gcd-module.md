# GCD Module ASIC Design

## About

Designed and verified a GCD module (Euclidean algorithm) by building an RTL state machine + block diagram, writing and simulating RTL, developing a CRV testbench in Verdi (99.62% coverage), and running a guided ASIC physical design flow (Cadence Innovus / Sky130 PDK, STA).

I was tasked with developing a module to calculate the greatest common denominator of two integers using the Euclidean algorithm (which works a process of iterative division). I designed a state machine and block diagram, then turned that into RTL. I then simulated my module, checking for latches and reset/output functionality, completing the digital design phase of the project.

My first semester on the digital design team was spent doing an onboarding project. Just as with the analog team, I came in with no prior experience in VLSI, meaning that I had to learn Verilog from scratch (my favorite resource was <a href="https://hdlbits.01xz.net/wiki/Problem_sets#Verilog_Language" target="_blank" rel="noopener noreferrer">HDL Bits</a>).

I then moved on to the design verification portion, which entailed making a test plan and a testbench for the module I designed in the design phase. I completed a troubleshooting/bugfixing assignment on the providing makefile, and implemented RTL for constrained random verification, which I simulated using Verdi. I attained 99.62% coverage.

The final phase of the project was the physical design. I was guided through the full ASIC physical design flow, from synthesis to creating a floorplan using the Cadence Innovus/Sky130 PDK and performing static timing analysis. I measured frequency, area, and power metrics, adjusting parameters to meet the given spec.

<figure style="margin: 1rem 0;">
  <img src="../assets/projects/verdi%20coverage%20onboarding.png" alt="Final DUT coverage from Verdi" style="margin: 0; display: block; border-radius: 8px;" />
  <figcaption style="color: #6b6b6b; font-size: 0.875rem; margin-top: 0.35rem;">Final DUT coverage from Verdi</figcaption>
</figure>

## Tools Used

- Verilog/SystemVerilog
- Verdi
- Cadence Innovus
- Sky130 PDK

## Skills Demonstrated

- State machine + block diagram design
- RTL implementation and simulation
- Test planning and testbench development
- Constrained random verification
- ASIC physical design fundamentals (synthesis, floorplanning, STA)
- Frequency, area, and power analysis

