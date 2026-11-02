import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    content = f.read()
salons = re.findall(r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"', content)
for s in salons:
    print(f'ID: {s[0]} | Slug: {s[2]} | Name: {s[1]}')
