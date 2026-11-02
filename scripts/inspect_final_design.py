import re

with open('final website design exact copy this .html', 'r', encoding='utf-8') as f:
    html = f.read()

print('Length in chars:', len(html))
print('Lines count:', len(html.splitlines()))

# Style blocks
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print('Style blocks count:', len(styles))
for i, s in enumerate(styles):
    print(f'Style {i} length: {len(s)} chars')

# Script blocks
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print('Script blocks count:', len(scripts))
for i, sc in enumerate(scripts):
    print(f'Script {i} length: {len(sc)} chars')

# Headings
h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
print('H1s:', [re.sub(r'<[^>]+>', '', h).strip() for h in h1s])

h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL)
print(f'H2s count: {len(h2s)}')
for h in h2s:
    clean = re.sub(r'<[^>]+>', '', h).strip()
    print('  H2:', clean.replace('\n', ' '))

# Check for images or svgs
img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
print('Images count:', len(img_srcs))
print('Images:', img_srcs[:20])

# Check for sections
sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', html)
print('Section IDs:', sections)

