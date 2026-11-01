with open('carrybird_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'IntersectionObserver', text)]
for idx in matches:
    print(text[idx-50:idx+350].replace('\n', ' '))
    print('---')

