import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/backend/functions/queues.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[:35]):
    print(f'{i+1}: {l}', end='')
