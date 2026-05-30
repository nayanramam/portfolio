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

Typical ring oscillators use inverters chained together, where increasing the number of inverters changes the frequency. I opted for a design using current-starved inverters, since the starving inverters allow control over oscillation frequency based on their sizing and they can be tied to an input voltage that allows for voltage based frequency control. This allows for fewer inverter stages to achieve the same frequencies as a typical ring oscillator.

I sourced the specific design from a 2016 paper by Suman et al. I used it to build a schematic in Cadence Virtuoso with the Sky130 PDK.

![AMS VCO Schematic](../assets/AMS%20VCO%20Schem.png)

I then calculated the required starve current and by proxy the W/L ratios to size the starving transistors based on my desired frequency of oscillation (500 MHz). The calculation can be seen in the design review attached at the bottom of the page.

I simulated over the ff, tt and ss corners, did a temperature sweep from 0-70 C, and checked frequency and power draw under all conditions, ensuring my module met the spec. I also designed a buffer that allowed the VCO to drive 1 pF of load capacitance while meeting the power spec. The oscillator module itself remained well under 1 mW of power draw, but with only three inverting stages and transistors of the sizes that enable the module to meet the frequency spec, it is unable to drive the required capacitance. The buffer remedies this. It works simply by inverting the signal an even number of times, with each inverter sized larger and larger to increase the load it can drive.

After simulating my schematic, I moved on to the layout phase of the project. I went through several design iterations, both to avoid spacing issues and to optimize the footprint. Eventually, after several iteration, I passed DRC and LVS. The final layout is below:

![Layout](../assets/projects/ring-vco.png)

The final portion of the project was to create a design review slideshow documenting the design process, schematics, simulation results, and layout. The slides are attached below.

<a href="../assets/projects/Nayan Ramam AMS Onboarding Design Review-5.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.5rem 1rem; background-color: #1a1a1a; color: #F5F0E8; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: background-color 0.2s ease; margin: 1rem 0;">Design Review Slides</a>

## Tools Used
- Cadence Virtuoso
- Cadence Pegasus
- Cadence Maestro
- Sky130 PDK

## Skills Demonstrated
- Analog IC design fundamentals
- Custom layout techniques
- Design verification (DRC/LVS)
- Corner and temperature analysis
- Buffer design for load driving
- Design iteration and optimization
