import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')
# Search for end of tabs
for i, l in enumerate(lines):
    if '{activeTab === "profile" && (' in l:
        print(f'Profile tab starts at line {i+1}')
        for j in range(i, len(lines)):
            if lines[j].strip() == ')}' and 'activeTab ===' not in lines[j-1]:
                print(f'Found closing at {j+1}: {lines[j]}')
