import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[55:92]):
    print(f'{i+56}: {l}', end='')
