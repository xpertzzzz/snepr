with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('hero-stats')
if pos != -1:
    print(text[pos-50:pos+600])

