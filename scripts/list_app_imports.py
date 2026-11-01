with open('app/app/(tabs)/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
imports = re.findall(r'from\s+["\']([^"\']+)["\']', text)
print("All imports in index.tsx:")
for imp in imports:
    print(" -", imp)

