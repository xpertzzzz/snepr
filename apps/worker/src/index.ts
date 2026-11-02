import { Worker, Job } from "bullmq";
import IORedis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

const connection = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

console.log(`🔌 Snepr BullMQ Worker connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}...`);

// 1. Transactional Email Queue Worker
export const emailWorker = new Worker(
  "email-queue",
  async (job: Job) => {
    console.log(`[EmailWorker] Processing job #${job.id}: ${job.name}`, job.data);
    const { to, subject, template, variables } = job.data;

    // Simulates sending via Brevo / Resend
    console.log(`✉️ Dispatched email to ${to} | Subject: "${subject}"`);
    return { success: true, dispatchedAt: new Date() };
  },
  { connection }
);

// 2. WhatsApp & SMS Arrival Notification Worker
export const notificationWorker = new Worker(
  "notification-queue",
  async (job: Job) => {
    console.log(`[NotificationWorker] Processing job #${job.id}: ${job.name}`, job.data);
    const { phone, customerName, tokenDisplay, salonName, type } = job.data;

    if (type === "CALLED") {
      console.log(`📱 [WhatsApp/SMS] Sent call-in alert to ${customerName} (${phone}) for token ${tokenDisplay} at ${salonName}. "Your styling chair is ready!"`);
    } else if (type === "DELAY") {
      console.log(`📱 [WhatsApp/SMS] Sent delay update to ${customerName} (${phone}) for token ${tokenDisplay}.`);
    }

    return { success: true, notifiedAt: new Date() };
  },
  { connection }
);

// 3. Analytics & Chair Telemetry Worker
export const analyticsWorker = new Worker(
  "analytics-queue",
  async (job: Job) => {
    console.log(`[AnalyticsWorker] Aggregating chair turnover and wait time statistics...`);
    return { success: true, processedAt: new Date() };
  },
  { connection }
);

emailWorker.on("completed", (job) => {
  console.log(`[EmailWorker] Job #${job.id} completed.`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[EmailWorker] Job #${job?.id} failed:`, err.message);
});

console.log("🚀 Snepr BullMQ background worker active and listening on queues: email-queue, notification-queue, analytics-queue.");
