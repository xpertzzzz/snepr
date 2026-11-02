import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'displayedSalons.map' in l or 'salons-list' in l:
        print(f'Found at line {i+1}')
        for j in range(i, min(i+50, len(lines))):
            print(f'{j+1}: {lines[j]}', end='')
        break
