import re

# 1. Update src/styles/snepr-final.css
with open('src/styles/snepr-final.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .foot-brand img rules
old_rule = ".foot-brand img{width:110px;filter:invert(1);mix-blend-mode:screen}"
new_rule = ".foot-brand img{width:145px;filter:brightness(0) invert(1);display:block;margin-bottom:18px}"

if old_rule in css:
    css = css.replace(old_rule, new_rule)

# Also ensure .foot-brand-logo has filter brightness(0) invert(1)
css = css.replace("filter: invert(1); mix-blend-mode: screen;", "filter: brightness(0) invert(1);")

# Ensure .foot-brand img has high specificity
css += """
.foot-brand img,
.foot-brand-logo {
  width: 145px !important;
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  filter: brightness(0) invert(1) !important;
  opacity: 1 !important;
  visibility: visible !important;
  margin-bottom: 18px !important;
}
"""

with open('src/styles/snepr-final.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated src/styles/snepr-final.css!")

# 2. Update index.tsx and pricing.tsx
for path in ['src/routes/_marketing/index.tsx', 'src/routes/_marketing/pricing.tsx']:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Use transparent logo in footer as requested
    content = content.replace('/snepr-logo-white-transparent.png', '/snepr-logo-transparent.png')

    # Update Instagram handle to sneprofficial
    content = content.replace('https://www.instagram.com/snepr.app/', 'https://www.instagram.com/sneprofficial/')
    content = content.replace('Follow @snepr.app', 'Follow @sneprofficial')

    # Remove "Technologies Inc." only keep "Snepr"
    content = content.replace('Snepr Technologies Inc.', 'Snepr')
    content = content.replace('Snepr Technologies Inc', 'Snepr')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {path}!")
