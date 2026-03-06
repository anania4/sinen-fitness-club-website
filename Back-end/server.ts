import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gym.db");

// Initialize database with some sample data
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    plan TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    goal TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_name TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    method TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    amount REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    duration TEXT NOT NULL,
    features TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    member_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id)
  );

  CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    fitness_group TEXT NOT NULL
  );
`);

// Seed data if empty
const memberCount = db.prepare("SELECT COUNT(*) as count FROM members").get() as { count: number };
if (memberCount.count === 0) {
  const insertMember = db.prepare("INSERT INTO members (name, plan, expiry_date, status) VALUES (?, ?, ?, ?)");
  insertMember.run("Alex Johnson", "Premium Annual", "2026-03-15", "active");
  insertMember.run("Sarah Miller", "Monthly Basic", "2026-03-10", "active");
  insertMember.run("Mike Ross", "Quarterly Pro", "2026-04-20", "active");
  insertMember.run("Emma Wilson", "Monthly Basic", "2026-03-08", "active");
  insertMember.run("David Chen", "Premium Annual", "2026-12-01", "active");

  const insertLead = db.prepare("INSERT INTO leads (name, phone, goal, preferred_time, status) VALUES (?, ?, ?, ?, ?)");
  insertLead.run("John Doe", "+1 234 567 890", "Weight Loss", "Morning", "pending");
  insertLead.run("Jane Smith", "+1 987 654 321", "Muscle Gain", "Evening", "contacted");
  insertLead.run("Robert Brown", "+1 555 012 345", "General Fitness", "Afternoon", "pending");

  const insertPayment = db.prepare("INSERT INTO payments (member_name, amount, date, method) VALUES (?, ?, ?, ?)");
  insertPayment.run("Alex Johnson", 499.99, "2026-03-01", "Credit Card");
  insertPayment.run("Sarah Miller", 49.99, "2026-03-02", "PayPal");
  insertPayment.run("Mike Ross", 149.99, "2026-02-28", "Cash");

  const insertRevenue = db.prepare("INSERT INTO revenue (month, amount) VALUES (?, ?)");
  insertRevenue.run("Oct", 4200);
  insertRevenue.run("Nov", 4800);
  insertRevenue.run("Dec", 5100);
  insertRevenue.run("Jan", 4900);
  insertRevenue.run("Feb", 5500);
  insertRevenue.run("Mar", 5800);

  const insertPlan = db.prepare("INSERT INTO plans (name, price, duration, features) VALUES (?, ?, ?, ?)");
  insertPlan.run("Monthly Basic", 49.99, "Monthly", "Gym Access, Locker Room, 1 Guest Pass/mo");
  insertPlan.run("Quarterly Pro", 129.99, "Quarterly", "Gym Access, Locker Room, All Classes, 5 Guest Passes/mo");
  insertPlan.run("Premium Annual", 449.99, "Annual", "24/7 Access, Personal Trainer, All Classes, Unlimited Guest Passes");

  const insertAttendance = db.prepare("INSERT INTO attendance (member_id, member_name, date, time) VALUES (?, ?, ?, ?)");
  insertAttendance.run(1, "Alex Johnson", "2026-03-05", "08:30");
  insertAttendance.run(2, "Sarah Miller", "2026-03-05", "09:15");
  insertAttendance.run(3, "Mike Ross", "2026-03-05", "17:45");

  const insertTeam = db.prepare("INSERT INTO team (name, role, fitness_group) VALUES (?, ?, ?)");
  insertTeam.run("Michael Chen", "Head Trainer", "Strength & Conditioning");
  insertTeam.run("Sarah Williams", "Yoga Instructor", "Flexibility & Wellness");
  insertTeam.run("David Martinez", "Personal Trainer", "Weight Loss");
  insertTeam.run("Emma Thompson", "Nutritionist", "Diet & Nutrition");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard/stats", (req, res) => {
    const totalMembers = db.prepare("SELECT COUNT(*) as count FROM members").get() as { count: number };
    const activeMembers = db.prepare("SELECT COUNT(*) as count FROM members WHERE status = 'active'").get() as { count: number };
    
    // Expiring soon (within 14 days)
    const today = new Date().toISOString().split('T')[0];
    const fourteenDaysLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const expiringSoon = db.prepare("SELECT COUNT(*) as count FROM members WHERE expiry_date BETWEEN ? AND ?").get(today, fourteenDaysLater) as { count: number };
    
    const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'pending'").get() as { count: number };

    res.json({
      totalMembers: totalMembers.count,
      activeMembers: activeMembers.count,
      expiringSoon: expiringSoon.count,
      newLeads: newLeads.count
    });
  });

  app.get("/api/dashboard/expiring-members", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const fourteenDaysLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const members = db.prepare("SELECT * FROM members WHERE expiry_date BETWEEN ? AND ? ORDER BY expiry_date ASC").all(today, fourteenDaysLater);
    res.json(members);
  });

  app.get("/api/dashboard/leads", (req, res) => {
    const leads = db.prepare("SELECT * FROM leads ORDER BY id DESC LIMIT 5").all();
    res.json(leads);
  });

  app.get("/api/dashboard/payments", (req, res) => {
    const payments = db.prepare("SELECT * FROM payments ORDER BY date DESC LIMIT 5").all();
    res.json(payments);
  });

  app.get("/api/dashboard/revenue", (req, res) => {
    const revenue = db.prepare("SELECT * FROM revenue ORDER BY id ASC").all();
    res.json(revenue);
  });

  // Full List Routes
  app.get("/api/members", (req, res) => {
    const members = db.prepare("SELECT * FROM members ORDER BY name ASC").all();
    res.json(members);
  });

  app.get("/api/leads", (req, res) => {
    const leads = db.prepare("SELECT * FROM leads ORDER BY id DESC").all();
    res.json(leads);
  });

  app.get("/api/payments", (req, res) => {
    const payments = db.prepare("SELECT * FROM payments ORDER BY date DESC").all();
    res.json(payments);
  });

  app.post("/api/payments", (req, res) => {
    const { member_name, amount, date, method } = req.body;
    const info = db.prepare("INSERT INTO payments (member_name, amount, date, method) VALUES (?, ?, ?, ?)").run(member_name, amount, date, method);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/payments/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM payments WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/attendance", (req, res) => {
    const attendance = db.prepare("SELECT * FROM attendance ORDER BY date DESC, time DESC").all();
    res.json(attendance);
  });

  app.post("/api/attendance", (req, res) => {
    const { member_id, member_name, date, time } = req.body;
    const info = db.prepare("INSERT INTO attendance (member_id, member_name, date, time) VALUES (?, ?, ?, ?)").run(member_id, member_name, date, time);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/attendance/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM attendance WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/plans", (req, res) => {
    const plans = db.prepare("SELECT * FROM plans ORDER BY price ASC").all();
    res.json(plans);
  });

  app.post("/api/plans", (req, res) => {
    const { name, price, duration, features } = req.body;
    const info = db.prepare("INSERT INTO plans (name, price, duration, features) VALUES (?, ?, ?, ?)").run(name, price, duration, features);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/plans/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, duration, features } = req.body;
    db.prepare("UPDATE plans SET name = ?, price = ?, duration = ?, features = ? WHERE id = ?").run(name, price, duration, features, id);
    res.json({ success: true });
  });

  app.delete("/api/plans/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM plans WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Settings & Telegram Config (using a simple key-value table or just in-memory for now, 
  // but let's add a table for persistence)
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(settings)) {
      upsert.run(key, String(value));
    }
    res.json({ success: true });
  });

  app.post("/api/settings/reset", (req, res) => {
    db.prepare("DELETE FROM members").run();
    db.prepare("DELETE FROM leads").run();
    db.prepare("DELETE FROM payments").run();
    db.prepare("DELETE FROM attendance").run();
    res.json({ success: true });
  });

  // Team Routes
  app.get("/api/team", (req, res) => {
    const team = db.prepare("SELECT * FROM team ORDER BY name ASC").all();
    res.json(team);
  });

  app.post("/api/team", (req, res) => {
    const { name, role, fitness_group } = req.body;
    const info = db.prepare("INSERT INTO team (name, role, fitness_group) VALUES (?, ?, ?)").run(name, role, fitness_group);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/team/:id", (req, res) => {
    const { id } = req.params;
    const { name, role, fitness_group } = req.body;
    db.prepare("UPDATE team SET name = ?, role = ?, fitness_group = ? WHERE id = ?").run(name, role, fitness_group, id);
    res.json({ success: true });
  });

  app.delete("/api/team/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM team WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Action Routes
  app.post("/api/members", (req, res) => {
    const { name, plan, expiry_date } = req.body;
    if (!name || !plan || !expiry_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const info = db.prepare("INSERT INTO members (name, plan, expiry_date, status) VALUES (?, ?, ?, ?)").run(name, plan, expiry_date, 'active');
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/members/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM members WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.patch("/api/members/:id", (req, res) => {
    const { id } = req.params;
    const { name, plan, expiry_date, status } = req.body;
    db.prepare("UPDATE members SET name = ?, plan = ?, expiry_date = ?, status = ? WHERE id = ?").run(name, plan, expiry_date, status, id);
    res.json({ success: true });
  });

  app.post("/api/leads", (req, res) => {
    const { name, phone, goal, preferred_time } = req.body;
    const info = db.prepare("INSERT INTO leads (name, phone, goal, preferred_time, status) VALUES (?, ?, ?, ?, ?)").run(name, phone, goal, preferred_time, 'pending');
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM leads WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.post("/api/members/:id/extend", (req, res) => {
    const { id } = req.params;
    const member = db.prepare("SELECT * FROM members WHERE id = ?").get(id) as any;
    if (!member) return res.status(404).json({ error: "Member not found" });

    // Extend by 30 days
    const currentExpiry = new Date(member.expiry_date);
    const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    db.prepare("UPDATE members SET expiry_date = ? WHERE id = ?").run(newExpiry, id);
    res.json({ newExpiry });
  });

  app.patch("/api/leads/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Serve admin dashboard in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "admin", "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "admin", "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
