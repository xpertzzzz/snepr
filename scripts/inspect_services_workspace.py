import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = re.findall(r'(\b\w*service\w*\b)', content, re.IGNORECASE)
print(f'Service occurrences: {len(matches)}')
