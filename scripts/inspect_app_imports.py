import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

lines = [line.strip() for line in text.splitlines() if line.strip().startswith('import')]
for line in lines:
    print(line)
