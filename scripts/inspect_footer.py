import re

with open('src/routes/_marketing/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<footer id="footer".*?</footer>', text, re.DOTALL)
if m:
    print('--- Footer in index.tsx ---')
    print(m.group(0))

with open('src/routes/_marketing/pricing.tsx', 'r', encoding='utf-8') as f:
    text_pricing = f.read()

m_p = re.search(r'<footer id="footer".*?</footer>', text_pricing, re.DOTALL)
if m_p:
    print('\n--- Footer in pricing.tsx ---')
    print(m_p.group(0))
