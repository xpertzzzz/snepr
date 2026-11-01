from PIL import Image

img_path = r'C:/Users/Ankit/.gemini/antigravity/brain/8ba27523-cf03-4a04-878b-69ca19fd9eaa/.user_uploaded/media_1793538724308_f0cb5581.png'
im = Image.open(img_path)
print("Uploaded image size:", im.size, "Mode:", im.mode)

for logo_path in ['public/snepr-logo.png', 'sneper-logo.jpeg']:
    try:
        lim = Image.open(logo_path)
        print(f"{logo_path} size: {lim.size}, mode: {lim.mode}")
    except Exception as e:
        print(f"Error {logo_path}: {e}")

