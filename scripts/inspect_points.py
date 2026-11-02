import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/points.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f'Total lines: {len(lines)}')
for i, l in enumerate(lines[:50]):
    print(f'{i+1}: {l}', end='')
