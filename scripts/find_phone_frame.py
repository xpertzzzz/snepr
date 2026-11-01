with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'phone-frame', text)]
print("Occurrences of phone-frame:", len(matches))
for idx in matches:
    print(text[max(0, idx-40):min(len(text), idx+60)].replace('\n', ' '))

