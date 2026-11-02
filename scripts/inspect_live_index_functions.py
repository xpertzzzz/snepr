with open('src/routes/live/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Functions in live/index.tsx:")
print(re.findall(r'function\s+([A-Za-z0-9_]+)', text))
print("UseQueries/Mutations:")
print(re.findall(r'useQuery|useMutation', text))
