# Analog Mixed-Signal Researcher | Integrated Computational Electronics (ICE) Lab

## Background

Paraphrasing the website, the ICE Lab focuses on configurable electronics/circuits and neuromorphic engineering. The project I currently work on falls into the configurable hardware bucket. The team I am on is developing a toolchain for programming circuits on Field Programmable Analog Arrays (FPAAs). At the bottom of this page I linked a number of resources explaining most of the concepts, but here is a TLDR:

### Key Terms
- **FPAA:** The analog counterpart to an FPGA. They are comprised of tiles of essential circuit elements (OTAs, caps, etc.) called Computational Analog Blocks (CABs) and digital Computational Logic Blocks (CLBs). Parameters and routing configurations are stored using floating gate transistors.
- **Floating Gate (FG) Transistor:** A MOSFET with an electrically isolated (i.e. "floating") gate that controls the threshold voltage based on the amount of charge stored in that gate.
- **Current-Starved Inverter:** A standard CMOS inverter with extra transistors that limit the current available to the inverting transistors (i.e. starving the current). This slows the rise and fall times, making the delay more controllable.

### Objective
For various reasons, FPAAs are used far less than FPGAs, meaning that the software platforms for programming them are much more primitive than something like Vivado or Quartus. In the digital world, one can use an assortment of applications to run RTL on an FPGA with minimal hassle. We aim to enable the same experience for FPAAs. To understand the usecases of such a tool, look no further than the FPGA. Digital computation on an FPGA is highly configurable; a change in RTL can be recompiled and resynthesized in minutes. The closest accessible analog equivalent is a PCB, and anyone who has design one will know that making a change to an already printed PCB is magnitudes more difficult. Typically the easiest solution is to just print a new one, which of course is expensive and time consuming. Thus, FPAAs appear to be a promising and ideal alternative.

## State of the Project
The lab has built a tool called RASP30 which allows for graphical circuit design using Scilab Xcos and a custom library. RASP is (more or less) functional, but the graphical UI is less than ideal. My team is working on an alternative pipeline that centers around a custom Python-based HDL.

## Tools Used
- RASP30 Toolchain
- Scilab Xcos
- FPAA (Field-Programmable Analog Array)

## Skills Demonstrated
- Analog circuit design
- Floating-gate circuit design
- FPAA programming and configuration

## Resources
*[Add relevant papers, documentation, or resources here]*

