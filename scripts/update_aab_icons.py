import zipfile
import os
import shutil
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
        tw = int(sz * 0.70)
        th = int(tw * (h / w))
        resized = snepr_mark.resize((tw, th), Image.Resampling.LANCZOS)
        ox = (sz - tw) // 2
        oy = (sz - th) // 2
        canvas.paste(resized, (ox, oy), mask=resized)
        return canvas

    def make_launcher(sz, is_round=False):
        canvas = Image.new('RGBA', (sz, sz), (250, 247, 242, 255))
        tw = int(sz * 0.78)
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
        tw = int(sz * 0.60)
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

    # Store bytes in memory
    files_to_replace = {}

    for density, sizes in densities.items():
        # WEBP versions for base/res/mipmap-{density}-v4/
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

        # AAB paths
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher.webp"] = l_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_round.webp"] = lr_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_foreground.webp"] = fg_buf.getvalue()
        files_to_replace[f"base/res/drawable-{density}-v4/splashscreen_logo.png"] = sp_buf.getvalue()

        # Also PNG versions if any exist
        fg_png_buf = BytesIO()
        fg_img.save(fg_png_buf, format='PNG')
        l_png_buf = BytesIO()
        l_img.save(l_png_buf, format='PNG')
        lr_png_buf = BytesIO()
        lr_img.save(lr_png_buf, format='PNG')

        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher.png"] = l_png_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_round.png"] = lr_png_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}-v4/ic_launcher_foreground.png"] = fg_png_buf.getvalue()

        # Also paths without -v4
        files_to_replace[f"base/res/mipmap-{density}/ic_launcher.webp"] = l_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}/ic_launcher_round.webp"] = lr_buf.getvalue()
        files_to_replace[f"base/res/mipmap-{density}/ic_launcher_foreground.webp"] = fg_buf.getvalue()
        files_to_replace[f"base/res/drawable-{density}/splashscreen_logo.png"] = sp_buf.getvalue()

    print(f"Prepared {len(files_to_replace)} replacement resources.")
    return files_to_replace

def update_aab(input_aab, output_aab, files_to_replace):
    print(f"Reading {input_aab} and creating {output_aab}...")
    with zipfile.ZipFile(input_aab, 'r') as zin:
        with zipfile.ZipFile(output_aab, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename in files_to_replace:
                    print(f"Replacing in AAB: {item.filename}")
                    zout.writestr(item, files_to_replace[item.filename])
                else:
                    zout.writestr(item, zin.read(item.filename))

    print("AAB updated successfully!")

def main():
    replacements = generate_icons()
    aab_path = 'playstore/Snepr-v1.0.4.aab'
    backup_aab = 'playstore/Snepr-v1.0.4-original.aab'
    temp_aab = 'playstore/Snepr-v1.0.4-updated.aab'
    
    if not os.path.exists(backup_aab):
        shutil.copyfile(aab_path, backup_aab)

    update_aab(backup_aab, temp_aab, replacements)
    shutil.move(temp_aab, aab_path)

    # Now run bundletool
    print("Building universal APK with bundletool and signing with release.keystore...")
    apks_path = 'playstore/Snepr-v1.0.4.apks'
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
    subprocess.run(cmd, check=True)

    # Extract universal.apk
    print("Extracting universal.apk...")
    apk_out = 'playstore/Snepr-v1.0.4-release.apk'
    with zipfile.ZipFile(apks_path, 'r') as z:
        z.extract('universal.apk', 'playstore')
    
    shutil.move('playstore/universal.apk', apk_out)
    print(f"Release APK created: {apk_out} (Size: {os.path.getsize(apk_out) / (1024*1024):.2f} MB)")

    # Copy to Desktop
    desktop_apk = r'C:\Users\Ankit\Desktop\Snepr-release.apk'
    shutil.copyfile(apk_out, desktop_apk)
    print(f"Copied to Desktop: {desktop_apk} (Size: {os.path.getsize(desktop_apk) / (1024*1024):.2f} MB)")

if __name__ == '__main__':
    main()

