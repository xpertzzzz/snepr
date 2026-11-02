with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'id="cutCopy".*?</div>', text, re.DOTALL)
if m:
    print(m.group(0))

