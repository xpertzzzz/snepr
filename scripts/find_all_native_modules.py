import zipfile, re

with zipfile.ZipFile('playstore/Snepr-v1.0.4-original.aab', 'r') as z:
    for df in [f for f in z.namelist() if f.endswith('.dex')]:
        data = z.read(df)
        print(f"=== {df} ({len(data)} bytes) ===")
        # Find all ReactPackage implementations
        packages = re.findall(b'L[a-zA-Z0-9_/]+ReactPackage;', data)
        if packages:
            print("ReactPackages:")
            for p in sorted(set(packages)):
                print("  ", p.decode())
        
        # Find all ExpoModulesPackage implementations
        expo_modules = re.findall(b'Lexpo/modules/[a-zA-Z0-9_/]+Module;', data)
        if expo_modules:
            print("Expo Modules:")
            for em in sorted(set(expo_modules)):
                print("  ", em.decode())

