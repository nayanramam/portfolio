#!/usr/bin/env python3
"""Organize downloaded project images"""
import os
from pathlib import Path
from PIL import Image

assets_dir = Path("assets/projects")
files = list(assets_dir.glob("*.jpg")) + list(assets_dir.glob("*.png"))

print(f"Found {len(files)} image files:")
for f in files:
    try:
        img = Image.open(f)
        print(f"  {f.name}: {img.size[0]}x{img.size[1]} pixels")
    except:
        print(f"  {f.name}: (could not read)")

# Check if we have the right images
# Based on typical project image sizes, we can identify them
# Ring VCO might be a circuit diagram (square-ish)
# AI Synth might be a UI/screenshot (wider)

if len(files) == 1:
    # Only one image downloaded - might be a header/logo
    print("\nOnly one image found. This might be a header image.")
    print("You may need to manually download project images from:")
    print("  https://nramam.framer.website/")
else:
    print("\nMultiple images found. Please identify which is which:")
    print("  - Ring VCO: Circuit diagram/layout image")
    print("  - AI Synth: Synthesizer interface/screenshot")

