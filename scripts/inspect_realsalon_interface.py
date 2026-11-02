import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find RealSalon interface
idx = content.find('export interface RealSalon')
if idx != -1:
    print(content[idx:idx+800])
