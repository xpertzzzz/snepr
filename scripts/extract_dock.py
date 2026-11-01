import re

with open('d:/FL/snepr/snepr_app_ui_designs.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<nav class="dock-bar">.*?</nav>', text, re.DOTALL)
if m:
    with open('scripts/extracted_dock.html', 'w', encoding='utf-8') as f_out:
        f_out.write(m.group(0))
    print('Wrote dock bar to scripts/extracted_dock.html')

