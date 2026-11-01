import base64

with open('app/assets/images/snepr-logo.png', 'rb') as f:
    b64_logo = base64.b64encode(f.read()).decode('utf-8')

with open('scripts/generate_crashfree_template.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('__SNEPR_LOGO_B64__', b64_logo)

with open('app/app/(tabs)/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully written app/app/(tabs)/index.tsx from template!")
