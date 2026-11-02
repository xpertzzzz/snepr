import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('final_clean_preview.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Styles
css_match = re.search(r'<style>(.*?)</style>', text, re.DOTALL)
css = css_match.group(1) if css_match else ""
print(f"CSS length: {len(css):,} characters")

# 2. Script
js_match = re.search(r'<script>(.*?)</script>', text, re.DOTALL)
js = js_match.group(1) if js_match else ""
print(f"JS length: {len(js):,} characters")

# 3. Body contents without script
body_match = re.search(r'<body>(.*?)<script>', text, re.DOTALL)
body = body_match.group(1) if body_match else ""
print(f"Body HTML length: {len(body):,} characters")

with open('scripts/extracted_body.html', 'w', encoding='utf-8') as f:
    f.write(body)

with open('scripts/extracted_css.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('scripts/extracted_js.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Saved extracted_body.html, extracted_css.css, extracted_js.js!")

