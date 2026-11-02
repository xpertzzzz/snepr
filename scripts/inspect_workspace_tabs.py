import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[140:230]):
    print(f'{i+141}: {l}', end='')
