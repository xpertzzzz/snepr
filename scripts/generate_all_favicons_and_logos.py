import os
import shutil
from PIL import Image

def generate_favicons():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    src_logo_rgb = os.path.join(root, 'snepr-logo.png')
    src_logo_trans = os.path.join(root, 'snepr-logo-transparent.png')
    
    public_dir = os.path.join(root, 'public')
    app_img_dir = os.path.join(root, 'app/assets/images')
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(app_img_dir, exist_ok=True)

    # 1. Copy exact original files to public and app assets
    print("Copying original logo files to public/ and app/assets/images/...")
    shutil.copyfile(src_logo_rgb, os.path.join(public_dir, 'snepr-logo.png'))
    shutil.copyfile(src_logo_trans, os.path.join(public_dir, 'snepr-logo-transparent.png'))
    shutil.copyfile(src_logo_rgb, os.path.join(app_img_dir, 'snepr-logo.png'))
    shutil.copyfile(src_logo_trans, os.path.join(app_img_dir, 'snepr-logo-transparent.png'))

    # If .output/public exists, also copy there
    out_pub = os.path.join(root, '.output/public')
    if os.path.exists(out_pub):
        shutil.copyfile(src_logo_rgb, os.path.join(out_pub, 'snepr-logo.png'))
        shutil.copyfile(src_logo_trans, os.path.join(out_pub, 'snepr-logo-transparent.png'))

    # 2. Build high-quality square favicons for browser title bar
    # Using the transparent logo, crop closely to contents, then center in a square with #FAF7F2 warm cream background
    im_trans = Image.open(src_logo_trans).convert('RGBA')
    bbox = im_trans.getbbox()
    cropped = im_trans.crop(bbox)
    cw, ch = cropped.size
    print(f"Cropped logo content size: {cw}x{ch}")

    def create_square_icon(size, bg_color=(250, 247, 242, 255), padding_ratio=0.88):
        canvas = Image.new('RGBA', (size, size), bg_color)
        target_w = int(size * padding_ratio)
        target_h = int(target_w * (ch / cw))
        if target_h > size * padding_ratio:
            target_h = int(size * padding_ratio)
            target_w = int(target_h * (cw / ch))
        
        resized = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
        ox = (size - target_w) // 2
        oy = (size - target_h) // 2
        canvas.paste(resized, (ox, oy), mask=resized)
        return canvas

    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'favicon.png': 64,
        'apple-touch-icon.png': 180,
        'android-chrome-192x192.png': 192,
        'android-chrome-512x512.png': 512,
    }

    print("Generating square favicon suite...")
    for filename, sz in sizes.items():
        sq = create_square_icon(sz)
        out_path = os.path.join(public_dir, filename)
        sq.save(out_path, format='PNG')
        print(f"  Generated {filename} ({sz}x{sz})")

        # Also update in app/assets/images/
        if filename in ['favicon.png', 'apple-touch-icon.png']:
            sq.save(os.path.join(app_img_dir, filename), format='PNG')

    # Multi-resolution favicon.ico
    ico_img_16 = create_square_icon(16)
    ico_img_32 = create_square_icon(32)
    ico_img_48 = create_square_icon(48)
    ico_path = os.path.join(public_dir, 'favicon.ico')
    ico_img_48.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print("  Generated favicon.ico (16, 32, 48px)")

    # Mobile app launcher icons
    icon_512 = create_square_icon(512)
    icon_512.save(os.path.join(app_img_dir, 'icon.png'), format='PNG')
    icon_512.save(os.path.join(app_img_dir, 'snepr-icon.png'), format='PNG')
    icon_512.save(os.path.join(app_img_dir, 'snepr-icon.webp'), format='WEBP')
    print("  Updated app/assets/images launcher icons!")

if __name__ == '__main__':
    generate_favicons()
