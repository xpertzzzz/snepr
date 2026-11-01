with open('app/app/(tabs)/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
fonts = re.findall(r'fontFamily:\s*[\'"]([^\'"]+)[\'"]', text)
print("Font families used in index.tsx:")
print(set(fonts))

