import base64

with open('app/assets/images/snepr-logo.png', 'rb') as f:
    b64_logo = base64.b64encode(f.read()).decode('utf-8')

print("Loaded b64 logo, length:", len(b64_logo))

