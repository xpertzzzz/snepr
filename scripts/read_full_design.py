import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('final website design exact copy this .html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the huge base64 data for readability
html_clean = re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', '[BASE64_IMAGE]', html)

# Let's see the CSS variables and key rules
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    css = style_match.group(1)
    print("=== CSS PREVIEW (first 100 lines) ===")
    lines = css.splitlines()
    for l in lines[:100]:
        print(l)
    print(f"... Total CSS lines: {len(lines)}")

# Let's list the body structure
body_match = re.search(r'<body>(.*?)</body>', html_clean, re.DOTALL)
if body_match:
    body = body_match.group(1)
    # Let's extract top-level tags
    print("\n=== TOP LEVEL ELEMENTS IN BODY ===")
    tags = re.findall(r'<(header|section|nav|main|footer|div|aside)[^>]*>', body)
    print(tags[:30])

