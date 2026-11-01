import zipfile, re

with zipfile.ZipFile('playstore/Snepr-v1.0.4-original.aab', 'r') as z:
    for df in [f for f in z.namelist() if f.endswith('.dex')]:
        data = z.read(df)
        pkgs = set(re.findall(b'Lcom/[a-zA-Z0-9_]+/[a-zA-Z0-9_/]+Package;', data))
        if pkgs:
            print(f"{df} com packages:")
            for p in sorted(pkgs):
                print(" ", p.decode())

