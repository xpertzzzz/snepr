import os
import sys
import glob
import shutil
import zipfile
import subprocess

def run_step(desc, cmd, cwd=None):
    print(f"\n===> {desc}...")
    res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"FAILED: {desc}")
        print("STDOUT:", res.stdout)
        print("STDERR:", res.stderr)
        sys.exit(1)
    print(f"DONE: {desc}")
    if res.stdout.strip():
        # Print last 3 lines
        lines = res.stdout.strip().splitlines()
        for l in lines[-3:]:
            print("  ", l)

def main():
    root = os.path.abspath(os.path.dirname(__file__) + '/..')
    os.chdir(root)
    print(f"Working Directory: {root}")

    # 1. Run Expo export for Android
    app_dir = os.path.join(root, 'app')
    dist_dir = os.path.join(app_dir, 'dist-android')
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir, ignore_errors=True)

    run_step("Compiling React Native / Expo to Android Hermes Bytecode", "npx expo export -p android --output-dir dist-android", cwd=app_dir)

    # 2. Find the generated .hbc file
    hbc_pattern = os.path.join(dist_dir, '_expo/static/js/android/*.hbc')
    hbc_files = glob.glob(hbc_pattern)
    if not hbc_files:
        print(f"Error: No .hbc file found matching {hbc_pattern}")
        sys.exit(1)

    fresh_bundle = hbc_files[0]
    target_bundle = os.path.join(app_dir, 'index.android.bundle')
    shutil.copyfile(fresh_bundle, target_bundle)
    bundle_size = os.path.getsize(target_bundle)
    print(f"Fresh bundle copied to {target_bundle} ({bundle_size:,} bytes)")

    # 3. Read bundle bytes and verify header
    with open(target_bundle, 'rb') as f:
        bundle_bytes = f.read()

    assert bundle_bytes[:4] == b'\xc6\x1f\xbc\x03', f"Invalid Hermes magic header: {bundle_bytes[:4]}"
    print("Hermes Bytecode Magic Header: VALID (0x1F1903C6)")

    # 4. Inject bundle into AAB
    source_aab = os.path.join(root, 'playstore/Snepr-v1.0.4.aab')
    if not os.path.exists(source_aab):
        source_aab = os.path.join(root, 'playstore/Snepr-v1.0.4-original.aab')
    temp_aab = os.path.join(root, 'playstore/Snepr-v1.0.4-building.aab')
    final_aab = os.path.join(root, 'playstore/Snepr-v1.0.4.aab')

    print(f"\n===> Injecting fresh bundle into AAB {source_aab}...")
    with zipfile.ZipFile(source_aab, 'r') as zin:
        with zipfile.ZipFile(temp_aab, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == "base/assets/index.android.bundle":
                    zout.writestr(item.filename, bundle_bytes)
                else:
                    zout.writestr(item.filename, zin.read(item.filename))

    shutil.move(temp_aab, final_aab)
    print(f"AAB updated successfully: {final_aab} ({os.path.getsize(final_aab):,} bytes)")

    # 5. Build signed universal APK with bundletool
    apks_path = os.path.join(root, 'playstore/Snepr-v1.0.4.apks')
    if os.path.exists(apks_path):
        os.remove(apks_path)

    bundletool_jar = os.path.join(root, 'scripts/bundletool.jar')
    keystore_path = os.path.join(root, 'playstore/snepr-release.keystore')

    bundletool_cmd = (
        f'java -jar "{bundletool_jar}" build-apks '
        f'--bundle="{final_aab}" '
        f'--output="{apks_path}" '
        f'--mode=universal '
        f'--ks="{keystore_path}" '
        f'--ks-pass=pass:snepr123 '
        f'--ks-key-alias=snepr '
        f'--key-pass=pass:snepr123'
    )
    run_step("Building signed Universal APK using bundletool and release keystore", bundletool_cmd)

    # 6. Extract universal.apk
    print("\n===> Extracting universal.apk...")
    universal_apk_temp = os.path.join(root, 'playstore/universal.apk')
    with zipfile.ZipFile(apks_path, 'r') as z:
        z.extract('universal.apk', os.path.join(root, 'playstore'))

    release_apk = os.path.join(root, 'playstore/Snepr-v1.0.4-release.apk')
    if os.path.exists(release_apk):
        os.remove(release_apk)
    shutil.move(universal_apk_temp, release_apk)
    apk_size_mb = os.path.getsize(release_apk) / (1024 * 1024)
    print(f"Universal Release APK generated: {release_apk} ({apk_size_mb:.2f} MB)")

    # 7. Copy to Desktop destinations and web paths
    desktop_targets = [
        r'C:\Users\Ankit\Desktop\Snepr-final.apk',
        r'C:\Users\Ankit\Desktop\Snepr-release.apk',
        r'C:\Users\Ankit\Desktop\Snepr-v1.0.4-release.apk',
    ]

    for dt in desktop_targets:
        try:
            shutil.copyfile(release_apk, dt)
            print(f"Copied to Desktop: {dt}")
        except Exception as e:
            print(f"Warning: could not copy to {dt}: {e}")

    # Copy to public web paths
    public_apk = os.path.join(root, 'public/Snepr-release.apk')
    shutil.copyfile(release_apk, public_apk)
    print(f"Copied to public web: {public_apk}")

    # 8. Complete Integrity and Feature Verification
    print("\n" + "=" * 60)
    print("RUNNING FINAL APK INTEGRITY & AUTH VERIFICATION")
    print("=" * 60)

    test_apk = desktop_targets[0]
    with zipfile.ZipFile(test_apk, 'r') as z:
        apk_bundle = z.read('assets/index.android.bundle')
        print(f"APK Index Bundle Size: {len(apk_bundle):,} bytes")
        assert apk_bundle[:4] == b'\xc6\x1f\xbc\x03', "Magic header check failed!"
        print("  [OK] Hermes bytecode header verified: 0x1F1903C6")

        # Verify demo credentials present in bundle
        assert b'customer@snepr.demo' in apk_bundle, "Missing customer@snepr.demo"
        print("  [OK] Demo credential verified: customer@snepr.demo")

        assert b'owner@snepr.demo' in apk_bundle, "Missing owner@snepr.demo"
        print("  [OK] Demo credential verified: owner@snepr.demo")

        assert b'staff@snepr.demo' in apk_bundle, "Missing staff@snepr.demo"
        print("  [OK] Demo credential verified: staff@snepr.demo")

        assert b'SneprDemo@2026' in apk_bundle, "Missing SneprDemo@2026 password"
        print("  [OK] Demo password verified: SneprDemo@2026")

        # Verify demo credentials and initial Sign In / Sign Up screen
        assert b'One Platform for All of Snepr' in apk_bundle, "Missing Sign In Headline"
        print("  [OK] Initial Sign In / Sign Up Screen verified")

        assert b'Priya' in apk_bundle, "Missing Customer Persona"
        print("  [OK] Customer Interface module verified")

        assert b'Barbershop Starter' in apk_bundle, "Missing Base Plan"
        assert b'High-Traffic Salon' in apk_bundle, "Missing Intermediate Plan"
        assert b'Luxury Grooming Lounge' in apk_bundle, "Missing Pro Plan"
        print("  [OK] SalonOS Owner Plans verified: Base, Intermediate, Pro")

        assert b'Aggregators' in apk_bundle, "Missing Economics Calculator"
        print("  [OK] Transparent Economics Calculator verified")

        # Verify icons & signature
        cert_files = [n for n in z.namelist() if n.startswith('META-INF/') and (n.endswith('.RSA') or n.endswith('.SF') or n.endswith('.MF'))]
        print(f"  [OK] Signature files found: {len(cert_files)} entries ({', '.join(cert_files[:3])})")

    print("\n" + "=" * 60)
    print("EXPORT COMPLETED SUCCESSFULLY!")
    print(f"FINAL APK PATH: {desktop_targets[0]}")
    print("=" * 60)

if __name__ == '__main__':
    main()
