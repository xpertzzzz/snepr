import os
from PIL import Image
import numpy as np

orig = Image.open('sneper-logo.jpeg').convert('RGB')
print("sneper-logo.jpeg size:", orig.size)

# Find bounding box
arr = np.array(orig)
gray = 0.299 * arr[:,:,0] + 0.587 * arr[:,:,1] + 0.114 * arr[:,:,2]
dark = gray < 200

coords = np.argwhere(dark)
ymin, xmin = coords.min(axis=0)
ymax, xmax = coords.max(axis=0)
print(f"sneper-logo.jpeg logo bounds: y {ymin} to {ymax} (h={ymax-ymin}), x {xmin} to {xmax} (w={xmax-xmin})")

# Add a tiny 2px padding
ymin = max(0, ymin - 2)
ymax = min(orig.size[1], ymax + 2)
xmin = max(0, xmin - 2)
xmax = min(orig.size[0], xmax + 2)

crop = orig.crop((xmin, ymin, xmax, ymax))

# Extract high-res transparent PNG of the pure wordmark
w, h = crop.size
arr_crop = np.array(crop)
lum = 0.299 * arr_crop[:,:,0] + 0.587 * arr_crop[:,:,1] + 0.114 * arr_crop[:,:,2]
alpha = np.clip((242 - lum) * 3.8, 0, 255).astype(np.uint8)

# Rich espresso color (#1B1410)
r_arr = np.full((h, w), 27, dtype=np.uint8)
g_arr = np.full((h, w), 20, dtype=np.uint8)
b_arr = np.full((h, w), 16, dtype=np.uint8)
rgba_arr = np.dstack((r_arr, g_arr, b_arr, alpha))
snepr_mark = Image.fromarray(rgba_arr, 'RGBA')

snepr_mark.save('public/snepr-logo-wordmark.png')
snepr_mark.save('public/snepr-logo.png')
if os.path.exists('.output/public'):
    snepr_mark.save('.output/public/snepr-logo.png')
    snepr_mark.save('.output/public/snepr-logo-wordmark.png')

print("Created high-res transparent PNG: public/snepr-logo.png and public/snepr-logo-wordmark.png")
print("Size:", snepr_mark.size)
