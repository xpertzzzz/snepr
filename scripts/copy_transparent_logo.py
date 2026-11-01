import shutil, os

src_logo = 'public/snepr-logo.png'
destinations = [
    'public/snepr-logo-wordmark.png',
    'app/assets/images/snepr-logo.png',
    '.output/public/snepr-logo.png',
    '.output/public/snepr-logo-wordmark.png',
]

for d in destinations:
    parent = os.path.dirname(d)
    if os.path.exists(parent):
        shutil.copyfile(src_logo, d)
        print(f"Copied to {d} (size: {os.path.getsize(d)})")
