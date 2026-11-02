import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[1280:1330]):
    print(f'{i+1281}: {l}', end='')
