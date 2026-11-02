import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    text = f.read()
import re
salons = re.findall(r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"', text)
for s in salons:
    print(f'{s[0]}: {s[1]} ({s[2]})')
