with open('carrybird_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Length of carrybird_website.html:", len(text))
keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9_\-]+)', text)
print("Keyframes in carrybird:", keyframes)
observers = re.findall(r'IntersectionObserver', text)
print("IntersectionObserver in carrybird:", len(observers))
# find any script at the end
lines = text.splitlines()
print("\nLast 50 lines of carrybird:")
for l in lines[-50:]:
    print(l[:100])

