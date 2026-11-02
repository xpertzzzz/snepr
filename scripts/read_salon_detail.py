with open('src/routes/live/salon.$id.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("salon.$id.tsx lines:", len(text.splitlines()))
print(text[:1800])
