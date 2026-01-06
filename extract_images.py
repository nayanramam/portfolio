#!/usr/bin/env python3
"""
Script to extract images from PDFs and download project images from Framer site
"""
import os
import sys
import requests
from pathlib import Path

def download_image(url, save_path):
    """Download an image from a URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://nramam.framer.website/'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        # Check if it's actually an image
        if not response.headers.get('content-type', '').startswith('image/'):
            return False
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"✓ Downloaded: {save_path}")
        return True
    except Exception as e:
        return False

def extract_from_pdf(pdf_path, output_dir):
    """Extract images from PDF using pdf2image"""
    try:
        from pdf2image import convert_from_path
        from PIL import Image
        
        print(f"Extracting images from {pdf_path}...")
        images = convert_from_path(pdf_path)
        
        for i, image in enumerate(images):
            output_path = output_dir / f"{pdf_path.stem}_page_{i+1}.png"
            image.save(output_path, 'PNG')
            print(f"✓ Extracted: {output_path}")
        
        # If we got images, use the first one as the project image
        if images:
            project_name = pdf_path.stem.replace('project_', '').replace('_', '-')
            project_image = output_dir / f"{project_name}.jpg"
            # Convert first page to JPG
            images[0].convert('RGB').save(project_image, 'JPEG', quality=85)
            print(f"✓ Created project image: {project_image}")
            return True
    except ImportError:
        print("pdf2image not installed. Install with: pip install pdf2image pillow")
        print("Also requires poppler: https://github.com/oschwartz10612/poppler-windows/releases")
        return False
    except Exception as e:
        print(f"✗ Failed to extract from PDF: {e}")
        return False

def main():
    # Create assets/projects directory if it doesn't exist
    assets_dir = Path("assets/projects")
    assets_dir.mkdir(parents=True, exist_ok=True)
    
    # Try to extract from PDFs
    reference_dir = Path("reference")
    pdfs = list(reference_dir.glob("project_*.pdf"))
    
    if pdfs:
        print("Found PDF files, attempting to extract images...")
        for pdf in pdfs:
            extract_from_pdf(pdf, assets_dir)
    else:
        print("No PDF files found in reference/ directory")
    
    # Try to download from Framer site (common image URLs)
    print("\nAttempting to download from Framer site...")
    framer_base = "https://nramam.framer.website"
    
    # Common Framer image URL patterns
    image_urls = [
        f"{framer_base}/_next/image?url=%2Fimages%2Fring-vco.jpg",
        f"{framer_base}/_next/image?url=%2Fimages%2Fai-synth.jpg",
        f"{framer_base}/images/ring-vco.jpg",
        f"{framer_base}/images/ai-synth.jpg",
    ]
    
    # Try to find images by inspecting the page
    try:
        response = requests.get(f"{framer_base}", timeout=10)
        if response.status_code == 200:
            # Look for image URLs in the HTML
            import re
            img_pattern = r'src=["\']([^"\']*\.(jpg|jpeg|png|webp)[^"\']*)["\']'
            found_images = re.findall(img_pattern, response.text, re.IGNORECASE)
            print(f"Found {len(found_images)} potential image URLs in HTML")
            
            for img_url, ext in found_images[:10]:  # Limit to first 10
                # Decode HTML entities
                import html
                img_url = html.unescape(img_url)
                
                if img_url.startswith('http'):
                    full_url = img_url
                elif img_url.startswith('/'):
                    full_url = f"{framer_base}{img_url}"
                else:
                    continue
                
                # Clean URL - remove query params for Framer images and use direct URL
                if 'framerusercontent.com' in full_url:
                    # Extract base URL without query params
                    base_url = full_url.split('?')[0]
                    # Try different sizes
                    for size in ['', '?width=1024', '?width=512']:
                        try_url = base_url + size if size else base_url
                        if download_image(try_url, assets_dir / f"temp_{len(found_images)}.jpg"):
                            break
                    continue
                
                # Determine filename
                filename = os.path.basename(img_url).split('?')[0]
                if 'ring' in filename.lower() or 'vco' in filename.lower():
                    save_path = assets_dir / "ring-vco.jpg"
                elif 'synth' in filename.lower() or 'ai' in filename.lower():
                    save_path = assets_dir / "ai-synth.jpg"
                else:
                    save_path = assets_dir / filename
                
                download_image(full_url, save_path)
    except Exception as e:
        print(f"Could not fetch Framer site: {e}")
    
    print("\n" + "="*50)
    print("Image extraction/download complete!")
    print("="*50)
    print("\nNext steps:")
    print("1. If PDF extraction worked, check assets/projects/ for extracted images")
    print("2. If you need to manually download images:")
    print("   - Visit https://nramam.framer.website/")
    print("   - Right-click on project images and 'Save image as...'")
    print("   - Save as assets/projects/ring-vco.jpg and assets/projects/ai-synth.jpg")
    print("\n3. Install pdf2image for PDF extraction:")
    print("   pip install pdf2image pillow")
    print("   Download poppler: https://github.com/oschwartz10612/poppler-windows/releases")

if __name__ == "__main__":
    main()

