with open('snepr_website.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<style>([\s\S]*?)</style>', text)
if m:
    css = m.group(1)
    for rule in re.finditer(r'(\.(?:phone-frame|demo-feature-item|demo-layout|demo-phone-box)[^{]*\{[^}]+\})', css):
        print(rule.group(1)[:120].strip().replace('\n', ' '))
        print('---')

