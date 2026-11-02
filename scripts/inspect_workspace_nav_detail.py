import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')
# Search for nav in aside
for i, l in enumerate(lines):
    if '<nav className="space-y-1.5">' in l:
        print(f'Nav starts at line {i+1}')
        for j in range(i, i+60):
            print(f'{j+1}: {lines[j]}', end='')
        break
