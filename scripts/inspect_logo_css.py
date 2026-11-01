with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
rules = re.findall(r'(\.(?:site-header|nav-capsule|snepr-logo-link|snepr-logo-img)[^{]*\{[^}]+\})', text)
for r in rules:
    print(r)
    print('---')

