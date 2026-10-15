---
title: GCD module ASIC design
tag: ASIC
category: ASIC design
wave: pulses
hint: RTL → P&R · 99.62% coverage
image: assets/projects/verdi coverage onboarding.png
image_alt: Final DUT coverage report from Verdi
summary: >
  Full-stack ASIC design of a module that computes the greatest common divisor of two integers with
  the Euclidean algorithm: a state machine and block diagram, RTL, a constrained-random testbench in
  Verdi, then a guided physical design flow — synthesis, floorplanning and static timing analysis in
  Cadence Innovus on Sky130 — tuned to meet frequency, area and power specs.
measurements:
  HDL: SystemVerilog
  Algorithm: Euclidean GCD
  Coverage: 99.62 % (DUT)
  Verif: Constrained-random · Verdi
  P&R: Cadence Innovus
  PDK: Sky130
  Signoff: STA · freq / area / power
---

## About

Designed and verified a GCD module (Euclidean algorithm) by building an RTL state machine + block diagram, writing and simulating RTL, developing a CRV testbench in Verdi (99.62% coverage), and running a guided ASIC physical design flow (Cadence Innovus / Sky130 PDK, STA).

I was tasked with developing a module to calculate the greatest common denominator of two integers using the Euclidean algorithm (which works a process of iterative division). I designed a state machine and block diagram, then turned that into RTL. I then simulated my module, checking for latches and reset/output functionality, completing the digital design phase of the project.

My first semester on the digital design team was spent doing an onboarding project. Just as with the analog team, I came in with no prior experience in VLSI, meaning that I had to learn Verilog from scratch (my favorite resource was [HDL Bits](https://hdlbits.01xz.net/wiki/Problem_sets#Verilog_Language)).

I then moved on to the design verification portion, which entailed making a test plan and a testbench for the module I designed in the design phase. I completed a troubleshooting/bugfixing assignment on the providing makefile, and implemented RTL for constrained random verification, which I simulated using Verdi. I attained 99.62% coverage.

The final phase of the project was the physical design. I was guided through the full ASIC physical design flow, from synthesis to creating a floorplan using the Cadence Innovus/Sky130 PDK and performing static timing analysis. I measured frequency, area, and power metrics, adjusting parameters to meet the given spec.

![Final DUT coverage from Verdi](assets/projects/verdi%20coverage%20onboarding.png)
*Final DUT coverage from Verdi*

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
