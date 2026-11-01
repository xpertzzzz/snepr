import zipfile

with zipfile.ZipFile('playstore/Snepr-v1.0.4-original.aab', 'r') as z:
    names = z.namelist()
    raw_files = [n for n in names if 'res/raw' in n]
    print("res/raw files in original AAB:", raw_files)
    assets_files = [n for n in names if 'assets/' in n]
    print("assets/ files in original AAB:", assets_files[:20])

