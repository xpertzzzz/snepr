import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/backend/functions/salons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'export const getSalonDetails' in l:
        for j in range(i, min(i+45, len(lines))):
            print(f'{j+1}: {lines[j]}', end='')
        break
