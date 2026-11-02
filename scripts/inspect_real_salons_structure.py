import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')
# Search for REAL_SALONS_DATA
for i, l in enumerate(lines):
    if 'REAL_SALONS_DATA' in l:
        print(f'Found at line {i+1}: {l}')
        for j in range(i, min(i+40, len(lines))):
            print(f'{j+1}: {lines[j]}', end='')
        break
