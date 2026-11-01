import os
import re

with open('snepr-final.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

m = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
if not m:
    print('Style tag not found in snepr-final.html')
    exit(1)

extracted_css = m.group(1).strip()

with open('src/styles.css', 'r', encoding='utf-8') as f:
    orig_css = f.read()

marker = '/* SNEPR-FINAL EXACT DESIGN SYSTEM */'
if marker in orig_css:
    orig_css = orig_css.split(marker)[0].strip()

new_css = orig_css + '\n\n' + marker + '\n' + extracted_css + '\n'

with open('src/styles.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print('Successfully appended exact snepr-final CSS to src/styles.css! Total bytes:', len(new_css))
