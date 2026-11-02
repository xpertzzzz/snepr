import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/backend/functions/salons.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Update import to include getSalonBySlug
old_import = 'import { REAL_SALONS_DATA, DEFAULT_SERVICES, DEFAULT_BARBERS } from "@/lib/real-salons";'
new_import = 'import { REAL_SALONS_DATA, DEFAULT_SERVICES, DEFAULT_BARBERS, getSalonBySlug } from "@/lib/real-salons";'
if old_import in code:
    code = code.replace(old_import, new_import, 1)

# Update getSalonDetails signature and handler
old_handler = """export const getSalonDetails = createServerFn({ method: "GET" })
  .validator((d: number) => d)
  .handler(async ({ data: id }) => {
    let salon = null;
    try {
      const res = await db.select().from(salons).where(eq(salons.id, id));
      if (res && res[0]) salon = res[0];
    } catch {}

    if (!salon) {
      const fallback = REAL_SALONS_DATA.find(s => s.id === Number(id)) || REAL_SALONS_DATA[0];
      return {
        ...fallback,
        services: DEFAULT_SERVICES,
        barbers: DEFAULT_BARBERS,
        reviews: [
          { id: 1, author: "Debabrata Dash", rating: 5, date: "Yesterday", comment: "Zero wait time! Token called right when I stepped in. Highly recommended." },
          { id: 2, author: "Sneha Priyadarshini", rating: 5, date: "2 days ago", comment: "Best hair styling experience in Patia. Clean, punctual, and professional." },
        ],
        waitingCount: fallback.waitingCount,
        inProgressCount: 2,
        estimatedWaitMins: fallback.waitTime,
      };
    }"""

new_handler = """export const getSalonDetails = createServerFn({ method: "GET" })
  .validator((d: string | number) => d)
  .handler(async ({ data: idOrSlug }) => {
    const raw = String(idOrSlug || "").trim();
    const num = Number(raw);
    const isNum = !isNaN(num) && num > 0;
    
    let salon = null;
    if (isNum) {
      try {
        const res = await db.select().from(salons).where(eq(salons.id, num));
        if (res && res[0]) salon = res[0];
      } catch {}
    } else if (raw) {
      try {
        const res = await db.select().from(salons).where(eq(salons.slug, raw));
        if (res && res[0]) salon = res[0];
      } catch {}
    }

    if (!salon) {
      const fallback = (raw ? getSalonBySlug(raw) : null) || (isNum ? REAL_SALONS_DATA.find(s => s.id === num) : null) || REAL_SALONS_DATA[0];
      return {
        ...fallback,
        services: fallback.services && fallback.services.length > 0 ? fallback.services : DEFAULT_SERVICES,
        barbers: fallback.barbers && fallback.barbers.length > 0 ? fallback.barbers : DEFAULT_BARBERS,
        chairs: fallback.chairs || [],
        reviews: [
          { id: 1, author: "Debabrata Dash", rating: 5, date: "Yesterday", comment: "Zero wait time! Token called right when I stepped in. Highly recommended." },
          { id: 2, author: "Sneha Priyadarshini", rating: 5, date: "2 days ago", comment: "Best hair styling experience in Bhubaneswar. Clean, punctual, and professional." },
          { id: 3, author: "Ankit Mohapatra", rating: 5, date: "3 days ago", comment: "Joined queue from phone, stepped straight into the barber chair!" },
        ],
        waitingCount: fallback.waitingCount,
        inProgressCount: 2,
        estimatedWaitMins: fallback.waitTime,
      };
    }"""

if old_handler in code:
    code = code.replace(old_handler, new_handler, 1)
    print("Updated getSalonDetails successfully")
else:
    print("Warning: old_handler not found")

with open('src/backend/functions/salons.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("File src/backend/functions/salons.ts written")
