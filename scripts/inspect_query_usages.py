files = [
    'src/components/admin/EmailCenter.tsx',
    'src/components/salon/SalonOSPortal.tsx',
    'src/routes/login.tsx',
    'src/routes/live/activity.tsx',
    'src/routes/live/queue.tsx',
    'src/routes/live/salon.$id.tsx',
    'src/routes/live/studio.tsx',
    'src/routes/_marketing/claim.tsx'
]

for p in files:
    print(f"=== {p} ===")
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for l in lines:
            if 'useQuery' in l or 'useMutation' in l or '@tanstack' in l:
                print("  ", l.strip()[:100])
