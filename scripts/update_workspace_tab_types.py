import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/salon/SalonOSWorkspace.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update SalonOSTab definition
old_type = 'export type SalonOSTab = "overview" | "staff" | "analytics" | "profile";'
new_type = 'export type SalonOSTab = "overview" | "queue" | "chairs" | "staff" | "services" | "customers" | "analytics" | "profile" | "settings";'

if old_type in content:
    content = content.replace(old_type, new_type, 1)
    print("Updated SalonOSTab type")

# 2. Update component signature to accept initialTab
old_sig = 'export function SalonOSWorkspace({ session }: { session: any }) {'
new_sig = '''export function SalonOSWorkspace({
  session,
  initialTab = "overview",
}: {
  session: any;
  initialTab?: SalonOSTab;
}) {'''

if old_sig in content:
    content = content.replace(old_sig, new_sig, 1)
    print("Updated SalonOSWorkspace signature")

# 3. Update activeTab state initialization
old_tab_state = '  const [activeTab, setActiveTab] = useState<SalonOSTab>("overview");'
new_tab_state = '''  const [activeTab, setActiveTab] = useState<SalonOSTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);'''

if old_tab_state in content:
    content = content.replace(old_tab_state, new_tab_state, 1)
    print("Updated activeTab state initialization")

with open('src/components/salon/SalonOSWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved partial update to SalonOSWorkspace.tsx")
