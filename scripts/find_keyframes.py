with open('src/styles.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
keyframes = re.findall(r'@keyframes\s+([a-zA-Z0-9_\-]+)', text)
print("Keyframes in src/styles.css:", keyframes)

