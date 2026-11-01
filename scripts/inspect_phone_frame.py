with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('.phone-frame')
if pos != -1:
    print(text[pos:pos+400])

