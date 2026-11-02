import re

with open('scripts/extracted_body.html', 'r', encoding='utf-8') as f:
    body = f.read()

inputs = re.findall(r'<input[^>]*>', body)
print(f"Inputs found: {len(inputs)}")
for inp in inputs:
    print(repr(inp))

imgs = re.findall(r'<img[^>]*>', body)
print(f"\nImages found: {len(imgs)}")
for img in imgs:
    print(repr(img))

