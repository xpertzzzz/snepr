import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/backend/functions/queues.ts', 'r', encoding='utf-8') as f:
    print(f.read()[:2000])
