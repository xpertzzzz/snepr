from PIL import Image
import numpy as np

img_path = r'C:/Users/Ankit/.gemini/antigravity/brain/8ba27523-cf03-4a04-878b-69ca19fd9eaa/.user_uploaded/media_1793538724308_f0cb5581.png'
im = Image.open(img_path).convert('RGB')
arr = np.array(im)

# Look at rows y from 20 to 120
gray = 0.299 * arr[:,:,0] + 0.587 * arr[:,:,1] + 0.114 * arr[:,:,2]
dark = (gray < 80) & (arr.shape[0] > 0)
# Ignore top 25 pixels which is the browser bar
dark[:25, :] = False

coords = np.argwhere(dark)
ymin, xmin = coords.min(axis=0)
ymax, xmax = coords.max(axis=0)
print(f"Logo text coords: y from {ymin} to {ymax} (h={ymax-ymin}), x from {xmin} to {xmax} (w={xmax-xmin})")
crop = im.crop((xmin, ymin, xmax, ymax))
crop.save('scripts/logo_crop_user.png')
print("Saved scripts/logo_crop_user.png")

