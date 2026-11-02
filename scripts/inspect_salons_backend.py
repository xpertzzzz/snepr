import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/backend/functions/salons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export const getSalonDetails.*?(?=export const|\Z)', text, re.DOTALL)
if m:
    print(m.group(0)[:1200])
