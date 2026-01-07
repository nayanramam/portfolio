# Digital Design/Hardware Systems Researcher | San José State University

## About

I was tasked with enabling high-throughput data streaming to a host computer (NVIDIA Jetson) using the Lattice Holoscan Sensor Bridge and JESD204B protocol. Initially, I tried to use NVIDIA's Holoscan SDK to write the software, but determined that implementing the RTL on the Sensor Bridge's FPGA was a better choice. Writing JESD204 IP from scratch in a summer was improbable given my lack of experience, so I searched for open source options. The only one I found was from Analog Devices and didn't support the Lattice FPGA I was using, but it was the only free option, so I decided to port it. I wrote new link and physical layers specific to the Lattice CertusPro-NX FPGA and with a great deal of experimentation, my simulations in Lattice Radiant worked. Unfortunately, I was not able to test my RTL on the Sensor Bridge, as it requires a Jetson device which the lab did not have at the time.

## Tools Used
- Lattice Radiant EDA
- Verilog
- JESD204B Protocol
- Lattice Holoscan Sensor Bridge

## Skills Demonstrated
- FPGA design and implementation
- Verilog RTL design
- IP core integration and adaptation
- EDA toolflow (synthesis, place-&-route, timing analysis)

