from PIL import Image
import numpy as np

img_path = r'C:/Users/Ankit/.gemini/antigravity/brain/8ba27523-cf03-4a04-878b-69ca19fd9eaa/.user_uploaded/media_1793538724308_f0cb5581.png'
im = Image.open(img_path)
arr = np.array(im)
print("Uploaded image shape:", arr.shape)

# Let's crop to just the logo in the uploaded image!
# Where is the dark text?
# Find bounding box of dark pixels
if arr.shape[2] == 4:
    rgb = arr[:,:,:3]
else:
    rgb = arr
gray = 0.299 * rgb[:,:,0] + 0.587 * rgb[:,:,1] + 0.114 * rgb[:,:,2]
dark_mask = gray < 100
coords = np.argwhere(dark_mask)
print("Dark pixels coords bounding box:", coords.min(axis=0), coords.max(axis=0))
ymin, xmin = coords.min(axis=0)
ymax, xmax = coords.max(axis=0)
print(f"BBox: x from {xmin} to {xmax} (width={xmax-xmin}), y from {ymin} to {ymax} (height={ymax-ymin})")

