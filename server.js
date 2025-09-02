// server.js (CommonJS, Express 5 + json-server 0.17.x)
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jsonServer = require("json-server"); // v0.17.4
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

// ===== CONFIG =====
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, "db.json"); // файл БД в корне

// ===== JWT / Cookies =====
const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const JWT_SECRET = process.env.JWT_SECRET || "acc_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "ref_secret";

function signAccess(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
}
function signRefresh(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}
function setCookie(res, name, value, opts = {}) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name, value, {
      httpOnly: true,
      sameSite: "lax", // для прод-https на другом домене: "none" + secure: true
      path: "/",
      secure: process.env.NODE_ENV === "production",
      ...opts,
    })
  );
}
function requireAuth(req, _res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return next({ status: 401, message: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next({ status: 401, message: "Token invalid/expired" });
  }
}

// ===== Ensure DB file =====
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(
      {
        users: [],
        cities: [],
        categories: [],
        masters: [],
        companies: [],
        orders: [],
        offers: [],
        reviews: [],
        comments: [],
        services: [],
      },
      null,
      2
    )
  );
  console.log("🆕 Создан пустой db.json");
}

// ===== APP =====
const app = express();

// ===== CORS (важно для Express 5: preflight на '(.*)') =====
const allowlist = new Set(
  (process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
  ]).map((s) => s.trim())
);
console.log("CORS allowlist:", [...allowlist]);

function corsOrigin(origin, cb) {
  // SSR/Postman без Origin — разрешаем; браузер — проверяем allowlist
  if (!origin || allowlist.has(origin)) return cb(null, true);
  cb(new Error(`CORS: Origin ${origin} not allowed`));
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    exposedHeaders: ["X-Total-Count", "Link"],
  })
);
// Express 5: нельзя '*' — используем '(.*)'
app.options(/.*/, cors({ origin: corsOrigin, credentials: true }));


app.use(express.json());

// ===== json-server =====
const router = jsonServer.router(DB_FILE); // lowdb v1 API
const middlewares = jsonServer.defaults({ logger: true });
app.use(middlewares);

// ===== AUTH =====
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name = "User" } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email и пароль обязательны" });

    const db = router.db;
    const exists = db.get("users").find({ email }).value();
    if (exists) return res.status(409).json({ message: "Пользователь уже существует" });

    const hash = await bcrypt.hash(password, 10);
    const id = Date.now();
    const user = {
      id,
      email,
      password: hash,
      name,
      role: "user",
      cityId: 1,
      favorites: [],
    };
    db.get("users").push(user).write();

    const accessToken = signAccess({ sub: id, role: user.role, email: user.email });
    const refreshToken = signRefresh({ sub: id });
    setCookie(res, "refresh", refreshToken, { maxAge: 7 * 24 * 3600 });

    const { password: _pw, ...safe } = user;
    res.json({ user: safe, accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Email и пароль обязательны" });

    const db = router.db;
    const user = db.get("users").find({ email }).value();
    if (!user) return res.status(401).json({ message: "Неверный логин или пароль" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Неверный логин или пароль" });

    const accessToken = signAccess({ sub: user.id, role: user.role, email: user.email });
    const refreshToken = signRefresh({ sub: user.id });
    setCookie(res, "refresh", refreshToken, { maxAge: 7 * 24 * 3600 });

    const { password: _pw, ...safe } = user;
    res.json({ user: safe, accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/refresh", (req, res) => {
  try {
    const raw = req.headers.cookie || "";
    const { refresh } = cookie.parse(raw || "");
    if (!refresh) return res.status(401).json({ message: "No refresh" });

    const payload = jwt.verify(refresh, REFRESH_SECRET);
    const db = router.db;
    const user = db.get("users").find({ id: payload.sub }).value();
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = signAccess({ sub: user.id, role: user.role, email: user.email });
    const newRefresh = signRefresh({ sub: user.id }); // ротация refresh
    setCookie(res, "refresh", newRefresh, { maxAge: 7 * 24 * 3600 });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh" });
  }
});

app.post("/auth/logout", (_req, res) => {
  setCookie(res, "refresh", "", { maxAge: 0 });
  res.json({ ok: true });
});

app.get("/auth/me", requireAuth, (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: req.user.sub }).value();
  if (!user) return res.status(404).json({ message: "Not found" });
  const { password: _pw, ...safe } = user;
  res.json({ user: safe });
});

app.get("/me/secure", requireAuth, (req, res) => {
  res.json({ sub: req.user.sub, ok: true });
});

// ===== API helpers & custom endpoints =====
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "X-Total-Count, Link");
  next();
});

// Пример: компании по subCategoryId с пагинацией
app.get("/companies/by-subcategory/:id", (req, res) => {
  const id = Number(req.params.id);
  const db = router.db;
  const all = db.get("companies").value() || [];
  const filtered = all.filter(
    (c) => Array.isArray(c.subCategoryIds) && c.subCategoryIds.includes(id)
  );
  const page = Number(req.query._page || 1);
  const limit = Number(req.query._limit || 10);
  const start = (page - 1) * limit;
  const end = start + limit;

  res.setHeader("X-Total-Count", String(filtered.length));
  res.json(filtered.slice(start, end));
});

// Подключаем json-server (все остальные ресурсы из db.json)
app.use("/", router);

// DEV сидер тестового пользователя
app.post("/dev/seed-user", async (_req, res) => {
  const db = router.db;
  const email = "test@example.com";
  const exists = db.get("users").find({ email }).value();
  if (exists) return res.json({ ok: true, email, note: "already exists" });
  const hash = await bcrypt.hash("123456", 10);
  const id = Date.now();
  db.get("users")
    .push({
      id,
      email,
      password: hash,
      name: "Test User",
      role: "user",
      cityId: 1,
      favorites: [],
    })
    .write();
  res.json({ ok: true, email, password: "123456" });
});

// ===== Error handler (аккуратный ответ JSON) =====
app.use((err, _req, res, _next) => {
  const status = err?.status || 500;
  const message = err?.message || "Server error";
  if (process.env.NODE_ENV !== "production") {
    console.error("ERR:", err);
  }
  res.status(status).json({ message });
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`✅ API запущен: http://localhost:${PORT}`);
  console.log(`📄 DB: ${DB_FILE}`);
});
