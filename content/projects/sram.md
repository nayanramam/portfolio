---
title: AI Inference SoC With Custom SRAM
tag: SRAM · SOC
category: SRAM / mixed-signal · in progress
wave: bitline
hint: 6T SRAM · RISC-V SoC · team of 6
thumb: assets/proj_thumbs/sram6tportschem.png
summary: >
  I’m leading a team of six building an AI inference SoC around a 32-bit RISC-V core. We’re currently developing a custom dual-port SRAM macro, with plans to integrate a dedicated systolic array for neural network inference.
measurements:
  Role: Team lead (6)
  System: RISC-V CPU + Multiply-Accumulate (MAC) accelerator
  Macro: 2 KB dual port (1R1W)
  Bit cell: Modified 6T
  Tool: Cadence Virtuoso
  Status: In progress
---

## About

The initial idea for this project was mixed-signal hardware acceleration. The plan was to read from memory through DACs, perform a dot product operation in the analog domain, then convert back to digital through an ADC. As we worked through the architecture, we narrowed the scope to something more achievable for a small team working in our limited free time. Our initial power analysis of the RISC-V SoC helped guide that direction. The OpenRAM SRAM macros we were using were by far the most power-hungry part of the chip. This led us to focus on custom SRAM alongside dedicated digital hardware for multiply-accumulate (MAC) computations.

## SRAM Design

I sourced the SRAM topology from a 2010 paper by Singh et al. [[1]](https://doi.org/10.1109/ISQED.2010.5450397). It is a modified version of the standard 6 transistor bit cell, adding two NFETs per word that allow for single ended, isolated read and write operations. Another unique aspect of this topology is that the read path does not pull charge from the bit-storing node. As seen in the schematic below, M1R, which would typically be oriented in a common gate configuration similar to the access NFET on the left (connecting WBL and the gates of the left inverter) instead connects its gate to the storage node, making for a non-destructive read and very good SNM.

## Hardware Acceleration

This aspect of the project is currently less fleshed out, but it centers around a dedicated digital accelerator for the multiply-accumulate (MAC) operations used in neural network inference. The RISC-V core will handle control and scheduling, while the accelerator processes multiple operations in parallel using data from our custom SRAM. We plan to explore low-precision integer arithmetic and data reuse, keeping intermediate results close to the MAC units to reduce memory accesses. The goal is to reduce energy per inference. In the future, we plan to extend this design to a systolic array to improve data reuse for matrix multiplication.

## Skills Demonstrated
- SRAM design
- Analog/mixed-signal circuit design
- Team leadership

## Tools Used
- Cadence Virtuoso

## References

1. J. Singh, D. S. Aswar, S. P. Mohanty, and D. K. Pradhan, “A 2-port 6T SRAM bitcell design with multi-port capabilities at reduced area overhead,” in *Proc. 11th Int. Symp. Quality Electronic Design (ISQED)*, San Jose, CA, USA, 2010, pp. 131–138, doi: [10.1109/ISQED.2010.5450397](https://doi.org/10.1109/ISQED.2010.5450397).
