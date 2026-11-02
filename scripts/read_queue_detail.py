with open('src/routes/live/queue.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("queue.tsx lines:", len(text.splitlines()))
print(text[:1500])
