import re

with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.findall(r'<section[^>]*>', text)
print("Sections found:")
for s in sections:
    print(s[:100])

classes = re.findall(r'class=["\']([^"\']+)["\']', text)
cards = set()
for c in classes:
    for item in c.split():
        if any(k in item.lower() for k in ['card', 'step', 'pillar', 'price', 'roi', 'feature', 'box', 'stat', 'preview', 'standee']):
            cards.add(item)

print("\nCard classes:")
for c in sorted(cards):
    print(" -", c)
