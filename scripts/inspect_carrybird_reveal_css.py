with open('carrybird_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\.reveal[^{]*\{[^}]+\})', text)
for m in matches:
    print(m)

