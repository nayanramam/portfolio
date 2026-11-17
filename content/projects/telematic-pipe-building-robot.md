---
title: Teleoperated pipe-building robot
tag: ROBOTICS
category: Robotics / embedded
wave: pwm
hint: ESP-NOW · RTSP · 2nd place
thumb: assets/proj_thumbs/robotech thumb.jpg
image: assets/proj_thumbs/robotech thumb.jpg
image_alt: Pipe-building robot
summary: >
  Built with my roommates in 36 hours at IEEE Robotech, Georgia Tech’s space-themed robotics
  hackathon, taking 2nd place in the controller track. The robot scales pipes and uses an arm to
  retrieve and append pipe segments, operated fully remotely with live video and telemetry. I worked on the GUI, communications (ESP-NOW, RTSP, USB serial), controls (joystick calibration, servo
  smoothing), and the robot’s servo/motor control and power distribution.
measurements:
  Result: 2nd place · IEEE Robotech
  MCU: ESP32 ×2 · Raspberry Pi 3B
  Control: ESP-NOW · 100 Hz
  Telemetry: 20 Hz → USB 921600 baud
  Video: RTSP · 720p
  Drive: PWM servos · H-bridge DC
  Power: 4S LiPo · XT60 PDB
video:
  youtube: TjeHNoKsTlI
  title: PIPE-BUILDING ROBOT · DEMO
---

## About

My roommates and I entered into IEEE Robotech, a 36-hour, space-themed robotics hackathon at Georgia Tech. We competed in the controller track, which (as the name suggests) emphasized telematic control of the robot, winning second place.

My team decided to construct a robot that can scale pipes, using a robotic arm to retrieve and append pipe segments (i.e. building them). We ensured fully remote operation, including a live video feed, a wireless controller, and telemetry data monitoring the robot's position and status. Our goal was to ease the process of constructing pipes in the harsh climates and non-ideal environments of space.

We give a brief overview and demo in this video:

<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/TjeHNoKsTlI" title="Pipe-building robot demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>

The electrical, embedded systems, and software work was highly collaborative between one of my teammates and I. Below are all the features we implemented. My emphasis was on the GUI, communications (ESP-NOW, RTSP, USB serial), controls (joystick calibration + servo smoothing) and the electronics on the robot unit (servo/motor controls + power distribution).

### Electrical/Embedded Specs

#### Controller Unit
- Reads three potentiometers & sends values to robot using ESP32
- Receieves telemetry data from robot & sends to laptop as JSON for the monitoring GUI

#### Robot Unit
- Controls three servos using PWM driver and two DC motors using H-bridge
- Gathers position data from servos and streams to controller unit using ESP-NOW
- 4s LiPo battery + PDB XT60 distribution board powering all motors and servos

#### Camera Unit
- Independent subsystem using Arducam and Raspberry Pi 3B (separate from ESP32s to minimize controller latency)
- Streams video from RPi to laptop @ 720p over WiFi using RTSP

#### Safety Features
- Servo angles limited to 0-180°
- Motor timeout: motors stop if no command given for 1 s

### Software

#### Commmunication/Telemetry
- ESP-NOW for bidirectional + low-latency communication between the robot and controller
    - 100 Hz control rate (takes priority over telemetry)
    - 20 Hz telemetry rate
    - data sent as binary packets with checksums
- Telemetry data is sent from the controller to the laptop as JSON
    - USB serial @ 921600 baud

#### Controls
- Joystick auto-calibration: 100 sample calibration on startup + 10% dead zone
    - Note: We eventually switchedf from joysticks to potentiometers, but the calibration software was tested and working
- Servo smoothing: rate-limited updates (30°/s elbow & wrist, 60°/s gripper)

#### Firmware + Monitoring GUI

- Firmware was written in C++ and built using PlatformIO, used Bounce2, Adafruit PWM Servo Driver, and WiFi libraries
- Telemetry data was displayed using a Python (PySide6) GUI and PySerial
- Video was streamed and displayed using VLC player and RTSP protocol

## Skills Demonstrated

- Telemetry systems & real-time monitoring
- Embedded firmware (C++)
- PWM servo control & DC motor control
- Wireless communication (ESP-NOW, RTSP)
- USB serial at high baud
- GUI development for monitoring

![Electrical build](assets/projects/electrical_img_1.jpg)
![Electrical build](assets/projects/electrical_img_2.jpg)
![Electrical build](assets/projects/electrical_img_3.jpg)

## Tools Used

- ESP32
- Raspberry Pi 3B
- PlatformIO
- C++
- Python (PySide6, PySerial)
- USB Serial, ESP-NOW, RTSP
- Adafruit PWM Servo Driver library
- Bounce2
