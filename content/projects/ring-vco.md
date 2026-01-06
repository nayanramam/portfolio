# Ring VCO in Cadence Virtuoso

## About

Silicon Jackets is Georgia Tech's chip design club. The onboarding project for their recently created analog mixed-signal sub-team was to create a ring oscillator that meets the following spec:

| Specification | Value |
|---------------|-------|
| Frequency Range | 450-550 MHz |
| Power Consumption | < 1 mW (oscillator module only) |
| Load Capacitance | 1 pF (with buffer) |
| Process Corners | ff, tt, ss |
| Temperature Range | 0-70°C |
| Supply Voltage | Sky130 PDK standard |

Typical ring oscillators use standard inverters chained together, where increasing the number of inverters changes the frequency. I opted for a design using current-starved inverters, since the starving inverters allow control over oscillation frequency based on their sizing and they can be tied to an input voltage that allows for voltage based frequency control. This allows for fewer inverter stages to achieve the same frequencies as a typical ring oscillator.

I sourced the specific design from a 2016 paper by Suman et al. I used it to build a schematic in Cadence Virtuoso with the Sky130 PDK.

![AMS VCO Schematic](../assets/AMS%20VCO%20Schem.png)

Something of note: this schematic ties the body of the middle transistors to their respective sources; this is not possible to fabricate, since all PMOS bodies must be tied to VDD and NMOS to ground. Unfortunately for me, I did not realize this until well into designing layouts.

I simulated over the ff, tt and ss corners, did a temperature sweep from 0-70 C, and checked frequency and power draw under all conditions, ensuring my module met the spec. I also designed a buffer that allowed the VCO to drive 1 pF of load capacitance while meeting the power spec. The oscillator module itself remained well under 1 mW of power draw, but with only three inverting stages and transistors of the sizes that enable the module to meet the frequency spec, it is unable to drive the required capacitance. The buffer remedies this. It works simply by inverting the signal an even number of times, with each inverter sized larger and larger to increase the load it can drive.

After simulating my schematic, I moved on to the layout phase of the project. I went through several design iterations, both to avoid spacing issues and to optimize the footprint. Only after nearing the completion of my second iteration did I realize the mistake with the bulks. It just so happened that I had placed my transistors in a way that made it faster to restart the layout than to try and salvage what I had. The third time around was far more successful; my layout passed DRC and LVS with much less trouble than the past designs. Thankfully, the buffer layout was much less of a hassle — that one passed with minimal troubleshooting. The final layouts are below:

![VCO Layout](../assets/project-placeholder.svg)

The final portion of the project was to create a design review slideshow documenting the design process, schematics, simulation results, and layout. The slides are attached below.

[Design Review Slides](#) *(placeholder link)*

## Tools Used
- Cadence Virtuoso Schematic Editor
- Cadence Virtuoso Layout Editor
- Spectre Circuit Simulator
- Sky130 PDK (Process Design Kit)

## Skills Demonstrated
- Analog IC design fundamentals
- Current-starved inverter design
- Full custom layout techniques
- Design verification (DRC/LVS)
- Corner and temperature analysis
- Buffer design for load driving
- Design iteration and optimization
