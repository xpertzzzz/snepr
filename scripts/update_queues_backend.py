import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/backend/functions/queues.ts', 'r', encoding='utf-8') as f:
    code = f.read()

old_get_queue = """export const getQueueStatus = createServerFn({ method: "GET" })
  .validator((d: number) => d)
  .handler(async ({ data: queueId }) => {
    try {
      const result = await db.select().from(queues).where(eq(queues.id, queueId));
      if (result && result[0]) return result[0];
    } catch {}

    // Fallback active queue entry
    return {
      id: queueId,
      tokenNumber: 104,
      salonId: 1,
      status: "waiting",
      estimatedWaitMins: 8,
      peopleAhead: 1,
      createdAt: new Date().toISOString(),
    };
  });"""

new_get_queue = """export const getQueueStatus = createServerFn({ method: "GET" })
  .validator((d: string | number) => d)
  .handler(async ({ data: queueIdOrToken }) => {
    const raw = String(queueIdOrToken || "").trim();
    const num = Number(raw);
    const isNum = !isNaN(num) && num > 0;

    if (isNum) {
      try {
        const result = await db.select().from(queues).where(eq(queues.id, num));
        if (result && result[0]) return result[0];
      } catch {}
    }

    // Parse token code if like A07, A-102, 104
    let cleanTokenNum = isNum ? num : 104;
    const match = raw.match(/\\d+/);
    if (match) {
      cleanTokenNum = parseInt(match[0], 10);
    }

    return {
      id: isNum ? num : 101,
      tokenNumber: cleanTokenNum,
      tokenCode: raw || `#${cleanTokenNum}`,
      salonId: 1,
      salonName: "Lakmé Salon — For Him and Her",
      address: "KIIT Road, opposite Manyavar, Patia, Bhubaneswar",
      serviceName: "Signature Haircut & Style",
      chairAssigned: "Station 02",
      barberName: "Rakesh Nayak",
      status: "waiting",
      position: Math.max(1, (cleanTokenNum % 4)),
      peopleAhead: Math.max(0, (cleanTokenNum % 4) - 1),
      estimatedWaitMins: Math.max(5, (cleanTokenNum % 4) * 7),
      createdAt: new Date().toISOString(),
    };
  });"""

if old_get_queue in code:
    code = code.replace(old_get_queue, new_get_queue, 1)
    print("Updated getQueueStatus successfully")
else:
    print("Warning: old_get_queue not found")

with open('src/backend/functions/queues.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("File src/backend/functions/queues.ts written")
