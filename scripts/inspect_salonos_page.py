import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/routes/salonos.tsx', 'r', encoding='utf-8') as f:
    print(f.read())
