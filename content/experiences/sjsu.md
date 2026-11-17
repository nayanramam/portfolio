---
org: San José State University
trace: SUMMER
roles:
  - title: Digital design researcher
    label: SJSU
    short: SJSU
    start: 2025-05
    end: 2025-08
    summary: >
      Ported Analog Devices’ open-source JESD204B IP to a Lattice CertusPro-NX FPGA (writing new
      link and physical layers) for high-throughput streaming to an NVIDIA Jetson through the
      Holoscan Sensor Bridge, verified in simulation in Lattice Radiant.
    tags: [verilog, fpga, serial]
---

## About

I was tasked with enabling high-throughput data streaming to a host computer (NVIDIA Jetson) using the Lattice Holoscan Sensor Bridge and JESD204B protocol. Initially, I tried to use NVIDIA's Holoscan SDK to write the software, but determined that implementing the RTL on the Sensor Bridge's FPGA was a better choice. Writing JESD204 IP from scratch in a summer was improbable given my lack of experience, so I searched for open source options. The only one I found was from Analog Devices and didn't support the Lattice FPGA I was using, but it was the only free option, so I decided to port it. I wrote new link and physical layers specific to the Lattice CertusPro-NX FPGA and with a great deal of experimentation, my simulations in Lattice Radiant worked. Unfortunately, I was not able to test my RTL on the Sensor Bridge, as it requires a Jetson device which the lab did not have at the time.

## Skills Demonstrated
- FPGA design and implementation
- Verilog RTL design
- IP core integration and adaptation
- EDA toolflow (synthesis, place-&-route, timing analysis)

## Tools Used
- Lattice Radiant EDA
- Verilog
- JESD204B Protocol
- Lattice Holoscan Sensor Bridge
