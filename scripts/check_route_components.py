import re

files = [
    'src/routes/_marketing/index.tsx',
    'src/routes/live/index.tsx',
    'src/routes/live/studio.tsx',
    'src/routes/login.tsx',
    'src/routes/salon/index.tsx'
]

for p in files:
    with open(p, 'r', encoding='utf-8') as f:
        text = f.read()
    m = re.search(r'component:\s*([a-zA-Z0-9_]+)', text)
    if m:
        print(f"{p} component: {m.group(1)}")
    else:
        print(f"{p} has no 'component: ...'")

