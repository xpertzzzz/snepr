import re

with open('scripts/extracted_body.html', 'r', encoding='utf-8') as f:
    body = f.read()

styles = re.findall(r'style="([^"]*)"', body)
print(f"Total style attributes found: {len(styles)}")
for s in sorted(set(styles)):
    print(repr(s))
