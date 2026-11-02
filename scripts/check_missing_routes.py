import os

for path in ['src/routes/how-it-works.tsx', 'src/routes/salonos.tsx', 'src/routes/explore.tsx']:
    print(f"{path} exists: {os.path.exists(path)}")
