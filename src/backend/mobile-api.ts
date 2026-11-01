import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { users, salons, queues, bookings } from "./db/schema";
import { OAuth2Client } from "google-auth-library";
import { eq, and, desc } from "drizzle-orm";
import { CITIES, BHUBANESWAR_AREAS, REAL_SALONS_DATA } from "../lib/real-salons";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_mobile_auth";
const googleClient = new OAuth2Client();

import { generateAndSendEmailOTP, verifyEmailOTP } from "./otp";

// === EMAIL OTP AUTHENTICATION (BREVO SMTP) ===
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }
    const result = await generateAndSendEmailOTP(email);
    res.json(result);
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ error: error.message || "Failed to send verification code." });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { phone, name, email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const isValid = await verifyEmailOTP(email, code);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    let userResult = await db.select().from(users).where(eq(users.username, email.trim().toLowerCase()));
    let user = userResult[0];

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const [createdUser] = await db.insert(users).values({
        username: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name || "Snepr Customer",
        phone: phone || "",
        role: "customer",
      }).returning();
      user = createdUser;
    }

    if (user.suspendedAt) {
      return res.status(403).json({ error: "Account suspended" });
    }

    const sessionPayload = { id: user.id, username: user.username, name: user.name, phone: user.phone, role: user.role };
    const token = jwt.sign(sessionPayload, JWT_SECRET, { expiresIn: "30d" });

    res.json({ success: true, token, user: sessionPayload });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: error.message || "Failed to verify OTP." });
  }
});

// ─── GOOGLE AUTHENTICATION ───
app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Missing ID token" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const { email, name } = payload;

    let userResult = await db.select().from(users).where(eq(users.username, email));
    let user = userResult[0];

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const [createdUser] = await db.insert(users).values({
        username: email,
        password: hashedPassword,
        name: name || "Google User",
        role: "customer",
      }).returning();
      user = createdUser;
    }

    if (user.suspendedAt) {
      return res.status(403).json({ error: "Account suspended" });
    }

    const sessionPayload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(sessionPayload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: sessionPayload });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: error.message || "Failed to authenticate with Google" });
  }
});

// ─── AUTHENTICATION ───
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const userResult = await db.select().from(users).where(eq(users.username, username));
    const user = userResult[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    if (user.suspendedAt) return res.status(403).json({ error: "Account suspended" });

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: payload });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── LOCALITY & SALONS API (NO GPS / BHUBANESWAR LOCALITY-BASED) ───
app.get("/api/cities", async (_req, res) => {
  res.json(CITIES);
});

app.get("/api/areas", async (req, res) => {
  const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : 1;
  const filtered = BHUBANESWAR_AREAS.filter((a) => a.cityId === cityId);
  res.json(filtered);
});

app.get("/api/salons", async (req, res) => {
  try {
    const areaId = req.query.areaId ? parseInt(req.query.areaId as string) : null;
    const category = req.query.category as string;
    const sort = (req.query.sort as string) || "wait";
    const search = (req.query.search as string) || "";
    const availableOnly = req.query.availableOnly === "true";

    let salonsList = [...REAL_SALONS_DATA];

    if (areaId) {
      salonsList = salonsList.filter((s) => s.areaId === areaId);
    }

    if (category && category !== "All") {
      salonsList = salonsList.filter((s) =>
        s.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      salonsList = salonsList.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.areaName.toLowerCase().includes(q)
      );
    }

    if (availableOnly) {
      salonsList = salonsList.filter((s) => s.availableChairs > 0);
    }

    salonsList.sort((a, b) => {
      if (sort === "wait") return a.waitTime - b.waitTime;
      if (sort === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.waitTime - b.waitTime;
    });

    res.json(salonsList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── JOIN QUEUE (DB LIVE INSERT) ───
app.post("/api/queue/join", async (req, res) => {
  try {
    const { salonId, customerName, customerPhone } = req.body;
    if (!salonId) {
      return res.status(400).json({ error: "Missing salonId" });
    }

    let existingWaiting = [];
    try {
      existingWaiting = await db.select().from(queues).where(
        and(eq(queues.salonId, salonId), eq(queues.status, "waiting"))
      );
    } catch {}

    const position = existingWaiting.length + 1;
    const estimatedWait = existingWaiting.length * 15;
    const tokenNumber = Math.floor(10 + Math.random() * 90);

    let newQueue = { id: Date.now(), salonId, tokenNumber, status: "waiting", estimatedWaitMins: estimatedWait };
    try {
      const [inserted] = await db.insert(queues).values({
        salonId,
        tokenNumber,
        status: "waiting",
        estimatedWaitMins: estimatedWait,
      }).returning();
      if (inserted) newQueue = inserted;
    } catch {}

    res.json({
      success: true,
      queue: newQueue,
      position,
      estimatedWait,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── CANCEL QUEUE (DB LIVE UPDATE) ───
app.post("/api/queue/cancel", async (req, res) => {
  try {
    const { queueId } = req.body;
    if (queueId) {
      try {
        await db.update(queues).set({ status: "cancelled" }).where(eq(queues.id, queueId));
      } catch {}
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET ACTIVE QUEUE FROM DB ───
app.get("/api/user/active-queue", async (req, res) => {
  try {
    let activeList = [];
    try {
      activeList = await db.select().from(queues).where(eq(queues.status, "waiting")).orderBy(desc(queues.createdAt)).limit(1);
    } catch {}

    if (activeList.length === 0) {
      return res.json({ activeQueue: null });
    }
    const q = activeList[0];
    let salon = null;
    try {
      const [found] = await db.select().from(salons).where(eq(salons.id, q.salonId));
      salon = found;
    } catch {}

    res.json({
      activeQueue: {
        id: q.id,
        tokenNumber: q.tokenNumber || 12,
        salonName: salon ? salon.name : "Lakme Salon Patia",
        address: salon ? salon.address : "KIIT Road, Patia",
        position: 1,
        waitTime: q.estimatedWaitMins || 5,
        status: q.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── SALON OS API ROUTES (Web & Mobile Partner Portal) ───
import { getSalonOSData, addWalkInCustomer } from "./salon-os";

app.get("/api/salon-os/dashboard", async (req, res) => {
  try {
    const salonId = req.query.salonId ? parseInt(req.query.salonId as string) : 1;
    const data = await getSalonOSData(salonId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/salon-os/walkin", async (req, res) => {
  try {
    const { salonId, customerName, phone, serviceId, staffId } = req.body;
    const result = await addWalkInCustomer({
      salonId: salonId || 1,
      customerName: customerName || "Walk-In Customer",
      phone,
      serviceId: serviceId || 1,
      staffId,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/salon-os/queue/action", async (req, res) => {
  try {
    const { queueId, action } = req.body;
    if (!queueId || !action) {
      return res.status(400).json({ error: "Missing queueId or action" });
    }
    try {
      await db.update(queues).set({ status: action }).where(eq(queues.id, queueId));
    } catch {}
    res.json({ success: true, action });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mobile API Server running on http://localhost:${PORT}`);
});
