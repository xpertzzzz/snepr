import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('final website design exact copy this .html', 'r', encoding='utf-8') as f:
    html = f.read()

# Head tags
head = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
if head:
    h_nostyle = re.sub(r'<style>.*?</style>', '<style>/* ... 21k chars CSS ... */</style>', head.group(1), flags=re.DOTALL)
    print("=== HEAD ===")
    print(h_nostyle.strip())

# Check header and footer
header = re.search(r'<header[^>]*>(.*?)</header>', html, re.DOTALL)
if header:
    print("\n=== HEADER ===")
    print(header.group(0)[:600])

footer = re.search(r'<footer[^>]*>(.*?)</footer>', html, re.DOTALL)
if footer:
    print("\n=== FOOTER ===")
    print(footer.group(0)[:600])

# Check all sections
sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\'][^>]*>', html)
print("\n=== SECTIONS ===")
for s in sections:
    print("Section id:", s)

# Check scripts
script = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if script:
    print("\n=== SCRIPT PREVIEW ===")
    print(script.group(1)[:1200])

# Check images
images = re.findall(r'<img[^>]+>', html)
print(f"\n=== IMAGES ({len(images)}) ===")
for img in images:
    if len(img) > 120:
        print(img[:100] + '... [TRUNCATED] ...' + img[-30:])
    else:
        print(img)
