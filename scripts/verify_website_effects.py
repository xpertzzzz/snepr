with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'class="[^"]*card-reveal[^"]*"', text)
print(f"Total elements with card-reveal: {len(matches)}")
for m in matches:
    print(" -", m)

counters = re.findall(r'data-count-target="[^"]+"', text)
print(f"Total counters: {len(counters)}")

spotlights = text.count('class="spotlight-glow"')
print(f"Total spotlight-glow divs: {spotlights}")

