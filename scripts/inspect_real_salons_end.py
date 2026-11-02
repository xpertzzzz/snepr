import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[-50:]):
    print(f'{len(lines)-50+i+1}: {l}', end='')
