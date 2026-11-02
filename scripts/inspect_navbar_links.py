with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
links = re.findall(r'<Link\s+to=\"([^\"]+)\"[^>]*>(.*?)</Link>', text)
for to, label in links:
    print(f"  {to} -> {label.strip()[:40]}")
