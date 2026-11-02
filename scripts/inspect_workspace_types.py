import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[25:65]):
    print(f'{i+26}: {l}', end='')
