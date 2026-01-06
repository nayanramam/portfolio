#!/usr/bin/env python3
"""Download project images from Framer site"""
import requests
import re
from pathlib import Path
from html import unescape

assets_dir = Path("assets/projects")
assets_dir.mkdir(parents=True, exist_ok=True)

framer_url = "https://nramam.framer.website/"

print("Fetching Framer site...")
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

try:
    response = requests.get(framer_url, headers=headers, timeout=10)
    response.raise_for_status()
    html = response.text
    
    # Look for project-related image URLs
    # Framer uses Next.js Image component, so look for src attributes
    # Also look for background-image URLs in style attributes
    
    print("\nSearching for project images...")
    
    # Pattern 1: Look for images near project titles
    ring_vco_patterns = [
        r'(ring[^"\']*vco[^"\']*\.(jpg|jpeg|png|webp))',
        r'(vco[^"\']*ring[^"\']*\.(jpg|jpeg|png|webp))',
    ]
    
    ai_synth_patterns = [
        r'(synth[^"\']*\.(jpg|jpeg|png|webp))',
        r'(ai[^"\']*synth[^"\']*\.(jpg|jpeg|png|webp))',
        r'(synthesizer[^"\']*\.(jpg|jpeg|png|webp))',
    ]
    
    # Pattern 2: Look for framerusercontent.com images
    framer_images = re.findall(r'https://framerusercontent\.com/images/[^"\'>\s]+', html)
    
    print(f"Found {len(framer_images)} Framer image URLs")
    
    # Try to identify project images by context
    # Look for image URLs near project titles in the HTML
    ring_vco_context = html.find("Ring VCO")
    ai_synth_context = html.find("AI Powered Virtual Synthesizer")
    
    # Find images near these contexts
    def find_nearby_images(context_pos, html_text, radius=2000):
        if context_pos == -1:
            return []
        start = max(0, context_pos - radius)
        end = min(len(html_text), context_pos + radius)
        section = html_text[start:end]
        return re.findall(r'https://framerusercontent\.com/images/[^"\'>\s]+', section)
    
    ring_images = find_nearby_images(ring_vco_context, html)
    synth_images = find_nearby_images(ai_synth_context, html)
    
    print(f"\nFound {len(ring_images)} images near 'Ring VCO'")
    print(f"Found {len(synth_images)} images near 'AI Synth'")
    
    # Download unique images
    all_images = list(set(framer_images))
    
    def download_image(url, filename):
        """Download image with proper headers"""
        try:
            # Clean URL - remove HTML entities and query params for direct access
            clean_url = unescape(url).split('?')[0]
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': framer_url
            }
            
            response = requests.get(clean_url, headers=headers, timeout=10, allow_redirects=True)
            response.raise_for_status()
            
            if not response.headers.get('content-type', '').startswith('image/'):
                return False
            
            filepath = assets_dir / filename
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            from PIL import Image
            img = Image.open(filepath)
            print(f"✓ Downloaded {filename}: {img.size[0]}x{img.size[1]}px")
            return True
        except Exception as e:
            print(f"✗ Failed {filename}: {e}")
            return False
    
    # Download images, prioritizing those near project titles
    downloaded = []
    
    # Try to download Ring VCO image
    if ring_images:
        for i, url in enumerate(ring_images[:2]):  # Try first 2
            if download_image(url, f"ring-vco-candidate-{i+1}.jpg"):
                downloaded.append(("ring-vco", f"ring-vco-candidate-{i+1}.jpg"))
                break
    
    # Try to download AI Synth image
    if synth_images:
        for i, url in enumerate(synth_images[:2]):  # Try first 2
            if download_image(url, f"ai-synth-candidate-{i+1}.jpg"):
                downloaded.append(("ai-synth", f"ai-synth-candidate-{i+1}.jpg"))
                break
    
    # If we didn't find context-specific images, download a few general ones
    if not downloaded and all_images:
        print("\nDownloading general images for manual identification...")
        for i, url in enumerate(all_images[:5]):
            download_image(url, f"project-image-{i+1}.jpg")
    
    print("\n" + "="*60)
    print("Download complete!")
    print("="*60)
    print("\nPlease check assets/projects/ and:")
    print("1. Identify which image is Ring VCO (circuit/layout)")
    print("2. Identify which image is AI Synth (synthesizer UI)")
    print("3. Rename them to:")
    print("   - assets/projects/ring-vco.jpg")
    print("   - assets/projects/ai-synth.jpg")
    print("\nOr manually download from:")
    print("   https://nramam.framer.website/")
    print("   (Right-click project images → Save image as...)")
    
except Exception as e:
    print(f"Error: {e}")
    print("\nManual download instructions:")
    print("1. Visit https://nramam.framer.website/")
    print("2. Right-click on each project image")
    print("3. Save as:")
    print("   - assets/projects/ring-vco.jpg")
    print("   - assets/projects/ai-synth.jpg")

