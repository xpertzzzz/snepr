import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/live/activity.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
print(f'Total lines: {len(lines)}')
for i, l in enumerate(lines[:60]):
    print(f'{i+1}: {l}', end='')
