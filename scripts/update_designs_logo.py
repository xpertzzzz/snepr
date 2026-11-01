with open('snepr_app_ui_designs.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'style="height:38px;width:auto;border-radius:8px;object-fit:contain;"',
    'style="height:48px;width:auto;border:none;background:transparent;object-fit:contain;"'
)

with open('snepr_app_ui_designs.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated snepr_app_ui_designs.html")

