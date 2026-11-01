import os
import shutil
import zipfile
import subprocess
from io import BytesIO
from PIL import Image, ImageDraw
import numpy as np

def generate_icons():
    print("Loading sneper-logo.jpeg...")
    orig = Image.open('sneper-logo.jpeg').convert('RGB')
    crop = orig.crop((86, 116, 633, 261))
    w, h = crop.size
    
    # Extract alpha mask: background is white, text is dark
    arr = np.array(crop)
    lum = 0.299 * arr[:,:,0] + 0.587 * arr[:,:,1] + 0.114 * arr[:,:,2]
    alpha = np.clip((245 - lum) * 3.5, 0, 255).astype(np.uint8)

    # Rich espresso color (#1B1410)
    r_arr = np.full((h, w), 27, dtype=np.uint8)
    g_arr = np.full((h, w), 20, dtype=np.uint8)
    b_arr = np.full((h, w), 16, dtype=np.uint8)
    rgba_arr = np.dstack((r_arr, g_arr, b_arr, alpha))
    snepr_mark = Image.fromarray(rgba_arr, 'RGBA')

    def make_foreground(sz):
        canvas = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        # Keep inside Android adaptive 66% circle mask:
        # Width at 58% ensures diameter sqrt(w^2 + h^2) < sz * 0.66
        tw = int(sz * 0.58)
        th = int(tw * (h / w))
        resized = snepr_mark.resize((tw, th), Image.Resampling.LANCZOS)
        ox = (sz - tw) // 2
        oy = (sz - th) // 2
        canvas.paste(resized, (ox, oy), mask=resized)
        return canvas

    def make_launcher(sz, is_round=False):
        canvas = Image.new('RGBA', (sz, sz), (250, 247, 242, 255))
        tw = int(sz * 0.68)
        th = int(tw * (h / w))
        resized = snepr_mark.resize((tw, th), Image.Resampling.LANCZOS)
        ox = (sz - tw) // 2
        oy = (sz - th) // 2
        canvas.paste(resized, (ox, oy), mask=resized)
        
        if is_round:
            mask = Image.new('L', (sz, sz), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, sz, sz), fill=255)
            round_canvas = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
            round_canvas.paste(canvas, (0, 0), mask=mask)
            return round_canvas
        return canvas

    def make_splash(sz):
        canvas = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        tw = int(sz * 0.52)
        th = int(tw * (h / w))
        resized = snepr_mark.resize((tw, th), Image.Resampling.LANCZOS)
        ox = (sz - tw) // 2
        oy = (sz - th) // 2
        canvas.paste(resized, (ox, oy), mask=resized)
        return canvas

    densities = {
        'mdpi': {'launcher': 48, 'foreground': 108, 'splash': 288},
        'hdpi': {'launcher': 72, 'foreground': 162, 'splash': 432},
        'xhdpi': {'launcher': 96, 'foreground': 216, 'splash': 576},
        'xxhdpi': {'launcher': 144, 'foreground': 324, 'splash': 864},
        'xxxhdpi': {'launcher': 192, 'foreground': 432, 'splash': 1152},
    }

    files_to_replace = {}

    for density, sizes in densities.items():
        fg_img = make_foreground(sizes['foreground'])
        fg_buf = BytesIO()
        fg_img.save(fg_buf, format='WEBP')
        
        l_img = make_launcher(sizes['launcher'], is_round=False)
        l_buf = BytesIO()
        l_img.save(l_buf, format='WEBP')
        
        lr_img = make_launcher(sizes['launcher'], is_round=True)
        lr_buf = BytesIO()
        lr_img.save(lr_buf, format='WEBP')
        
        sp_img = make_splash(sizes['splash'])
        sp_buf = BytesIO()
        sp_img.save(sp_buf, format='PNG')

        # Target paths in AAB - strictly match existing keys in original AAB
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher.webp"] = l_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_round.webp"] = lr_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_foreground.webp"] = fg_buf.getvalue()
        files_to_replace[f"base/res/drawable-{density}-v4/splashscreen_logo.png"] = sp_buf.getvalue()

    print(f"Generated {len(files_to_replace)} icon replacements.")
    return files_to_replace

def update_aab_bundle_and_icons(source_aab, target_aab, icon_replacements, bundle_path, font_dir):
    print("Reading freshly compiled Hermes bundle...")
    with open(bundle_path, 'rb') as f:
        hermes_bundle_bytes = f.read()

    print(f"Hermes bundle size: {len(hermes_bundle_bytes)} bytes. Header: {hermes_bundle_bytes[:4]}")
    assert hermes_bundle_bytes[:4] == b'\xc6\x1f\xbc\x03', "Not valid Hermes bytecode!"

    replacements = dict(icon_replacements)
    replacements["base/assets/index.android.bundle"] = hermes_bundle_bytes

    # Fonts to inject into base/assets/fonts/ (assets don't require resources.pb registration)
    font_files = {
        "SpaceGrotesk-Bold.ttf": os.path.join(font_dir, "SpaceGrotesk-Bold.ttf"),
        "SpaceGrotesk-Medium.ttf": os.path.join(font_dir, "SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-Regular.ttf": os.path.join(font_dir, "SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-SemiBold.ttf": os.path.join(font_dir, "SpaceGrotesk-SemiBold.ttf"),
        "SpaceMono-Regular.ttf": os.path.join(font_dir, "SpaceMono-Regular.ttf"),
    }

    for font_name, file_path in font_files.items():
        if os.path.exists(file_path):
            with open(file_path, 'rb') as ff:
                replacements[f"base/assets/fonts/{font_name}"] = ff.read()
                print(f"Prepared font asset: base/assets/fonts/{font_name}")

    print(f"Updating {source_aab} -> {target_aab}...")
    written_keys = set()
    with zipfile.ZipFile(source_aab, 'r') as zin:
        with zipfile.ZipFile(target_aab, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename in replacements:
                    print(f"Overwriting: {item.filename}")
                    zout.writestr(item.filename, replacements[item.filename])
                    written_keys.add(item.filename)
                else:
                    zout.writestr(item.filename, zin.read(item.filename))

            # Add only asset keys (not res/)
            for key, data in replacements.items():
                if key not in written_keys and key.startswith("base/assets/"):
                    print(f"Adding new asset: {key}")
                    zout.writestr(key, data)

    print("AAB updated successfully with new bundle, fonts, and icons!")

def build_universal_apk():
    aab_path = 'playstore/Snepr-v1.0.4.aab'
    apks_path = 'playstore/Snepr-v1.0.4.apks'
    apk_out = 'playstore/Snepr-v1.0.4-release.apk'
    desktop_apk = r'C:\Users\Ankit\Desktop\Snepr-release.apk'

    if os.path.exists(apks_path):
        os.remove(apks_path)

    cmd = [
        'java', '-jar', 'scripts/bundletool.jar', 'build-apks',
        f'--bundle={aab_path}',
        f'--output={apks_path}',
        '--mode=universal',
        '--ks=playstore/snepr-release.keystore',
        '--ks-pass=pass:snepr123',
        '--ks-key-alias=snepr',
        '--key-pass=pass:snepr123'
    ]
    print("Running bundletool to create signed universal APK...")
    subprocess.run(cmd, check=True)

    print("Extracting universal.apk...")
    with zipfile.ZipFile(apks_path, 'r') as z:
        z.extract('universal.apk', 'playstore')
    
    if os.path.exists(apk_out):
        os.remove(apk_out)
    shutil.move('playstore/universal.apk', apk_out)
    print(f"Universal APK created: {apk_out} ({os.path.getsize(apk_out) / (1024*1024):.2f} MB)")

    # Copy to Desktop
    shutil.copyfile(apk_out, desktop_apk)
    print(f"SUCCESS: Copied to Desktop -> {desktop_apk}")

    # Also update web public paths
    public_apk = 'public/Snepr-release.apk'
    shutil.copyfile(apk_out, public_apk)
    if os.path.exists('.output/public'):
        shutil.copyfile(apk_out, '.output/public/Snepr-release.apk')

    # Verification
    print("\n--- RUNNING INTEGRITY VERIFICATION ---")
    with zipfile.ZipFile(desktop_apk, 'r') as z:
        bundle_data = z.read('assets/index.android.bundle')
        print(f"Desktop APK bundle size: {len(bundle_data)} bytes")
        assert bundle_data[:4] == b'\xc6\x1f\xbc\x03', "Header verification failed!"
        print("Hermes bytecode valid: YES")
        
        has_urban = b'Urban Blade Grooming' in bundle_data
        has_studio = b'Hairstyle Consultation' in bundle_data
        has_jawed = b'Jawed Habib' in bundle_data
        print(f"Urban Blade Grooming present: {has_urban}")
        print(f"Hairstyle Consultation Studio present: {has_studio}")
        print(f"Old Jawed Habib present: {has_jawed}")

        assert has_urban, "Urban Blade missing!"
        assert has_studio, "Snepr Studio missing!"
        assert not has_jawed, "Old Jawed Habib data still present!"

        # Verify icon
        fg_data = z.read('res/mipmap-xxxhdpi-v4/ic_launcher_foreground.webp')
        print(f"Foreground icon xxxhdpi size: {len(fg_data)} bytes")
        l_data = z.read('res/mipmap-xxxhdpi-v4/ic_launcher.webp')
        print(f"Launcher icon xxxhdpi size: {len(l_data)} bytes")

    print("\nALL VERIFICATIONS PASSED 100%!")

def main():
    icons = generate_icons()
    original_aab = 'playstore/Snepr-v1.0.4-original.aab'
    target_aab = 'playstore/Snepr-v1.0.4.aab'
    temp_aab = 'playstore/Snepr-v1.0.4-temp.aab'
    bundle_path = 'd:/FL/snepr/app/index.android.bundle'
    font_dir = 'd:/FL/snepr/app/assets/fonts'

    update_aab_bundle_and_icons(original_aab, temp_aab, icons, bundle_path, font_dir)
    shutil.move(temp_aab, target_aab)
    build_universal_apk()

if __name__ == '__main__':
    main()
