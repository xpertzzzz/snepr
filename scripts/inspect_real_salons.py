import re

with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

names = re.findall(r'name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"', text)
print("Salons found in real-salons.ts:", len(names))
for n, s in names[:10]:
    print(f" - {n} ({s})")
