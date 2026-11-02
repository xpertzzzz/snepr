import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/salon-os/index.tsx', 'r', encoding='utf-8') as f:
    print(f.read())
