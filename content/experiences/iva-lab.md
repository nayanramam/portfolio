# Image Processing/Deep Learning Researcher | Intelligent Vision Automation (IVA) Lab

## The Project

My team was brought on to migrate and expand a MATLAB application that parses and processes floorplans. It detects door, rooms, elevators, etc. with the intent of creating a mapping application for the indoors. A primary usecase would be for people with accessibility requirements (e.g. unable to use stairs), but is also extremely useful for navigating large, complex buildings like malls. We are developing the same application, but using Python and Flet as opposed to MATLAB. We have now nearly matched all functionality in the MATLAB application, and have started developing new image processing capabilities.

## My Contributions

Migrating the codebase began with building out the equivalent framework. We have a group of classes that can collectively describe any indoor floorplan. These classes include doors, walkways, furniture, regions (i.e. open space), stairs, etc. Each class has item-specific properties, and all the items are organized by an inheritance tree. The more time-consuming part was to convert the class methods, since each item has unique functions for parsing, and each MATLAB class file ranged from 500 to 5000 lines long. I focused mainly on the image processing methods for the threshold and floor classes, both of which are several thousand lines long, as they are essential items from which many of the other items are derived. Through this process, I gained comfortability with NumPy, OpenCV, and Scipy/Scikit-learn, all of which were critical in mirroring the behaviors of MATLAB's image processing toolbox.

I am currently working on two things. The first is the door detection and parsing pipeline. We have MATLAB code for detecting doors that are perfect semicircles, but it relies heavily on built in functions that don't exist in Python, so I built out a small library of Python functions emulating MATLAB. I am also researching ways to implement machine learning into the door detection pipeline. I have been experimenting with keypoint deep networks and CNNs, although the biggest challenge I must figure out is how to collect labeled training data.

## Tools Used
- Python
- MATLAB
- Deep Learning Frameworks (PyTorch)
- Image Processing Libraries (OpenCV, Numpy, Scipy)

## Skills Demonstrated
- Code migration and refactoring (MATLAB to Python)
- Large-scale codebase conversion (12k+ LOC)
- Image processing
- Deep learning

