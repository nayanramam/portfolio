---
title: GCD module ASIC design
tag: ASIC
category: ASIC design
wave: pulses
hint: RTL → P&R · 99.62% coverage
thumb: assets/proj_thumbs/verdi coverage onboarding.png
summary: >
  Full-stack ASIC design of a module that computes the greatest common divisor of two integers with
  the Euclidean algorithm: a state machine and block diagram, RTL, a constrained-random testbench in
  Verdi, then a guided physical design flow (synthesis, floorplanning and static timing analysis in
  Cadence Innovus on Sky130) tuned to meet frequency, area and power specs.
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

This was my onboarding project for SiliconJackets' digital design team. I joined with no prior VLSi experience, so this was my first taste of ASIC design.

I was tasked with developing a module to calculate the greatest common divisor of two integers using the Euclidean algorithm (which works by a process of iterative division). I designed a state machine and block diagram, then turned that into RTL. I then simulated my module, checking for latches and reset/output functionality.

I then moved on to the design verification portion, which entailed making a test plan and a testbench. I completed a troubleshooting/bugfixing assignment on the provided makefile, and implemented RTL for constrained random verification, which I simulated using Verdi. I attained 99.62% DUT coverage.

The final phase of the project was the physical design. I was guided through the full ASIC physical design flow, from synthesis to creating a floorplan using the Cadence Innovus/Sky130 PDK and performing static timing analysis. I measured frequency, area, and power metrics, adjusting parameters to meet the given spec.


## Skills Demonstrated

- State machine + block diagram design
- RTL implementation and simulation
- Test planning and testbench development
- Constrained random verification
- ASIC physical design fundamentals (synthesis, floorplanning, STA)
- Frequency, area, and power analysis

## Tools Used

- Verilog/SystemVerilog
- Verdi
- Cadence Innovus
- Sky130 PDK
