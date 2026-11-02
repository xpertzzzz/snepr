import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/live/queue.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[100:190]):
    print(f'{i+101}: {l}', end='')
