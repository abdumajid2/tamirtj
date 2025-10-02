// server.cjs
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

const DEV = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

app.set("trust proxy", 1);

// --- CORS ---
const STATIC_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3003",
  "http://127.0.0.1:3003",
  "https://tamirtj-uiff.vercel.app",
];
function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (STATIC_ORIGINS.includes(origin)) return true;
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith(".ngrok-free.dev")) return true;
  } catch {}
  return false;
}
const corsOptions = {
  origin(origin, cb) { cb(null, isAllowedOrigin(origin)); },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

app.use(cors(corsOptions));

// ВАЖНО: без '*' — обрабатываем preflight вручную
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // CORS мидлвар уже поставил Allow-Origin/Credentials
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.sendStatus(204);
    return;
  }
  next();
});

// --- COMMON ---
app.use(express.json());
app.use(cookieParser());

// --- Helpers/Auth ---
const users = new Map();
let seqId = 1;
const signAccess  = (u) => jwt.sign({ id: u.id, email: u.email, role: u.role }, JWT_SECRET, { expiresIn: "15m" });
const signRefresh = (u) => jwt.sign({ id: u.id }, JWT_SECRET, { expiresIn: "7d" });
function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: DEV ? false : true,
    sameSite: DEV ? "lax" : "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

app.get("/health", (_req, res) => res.json({ ok: true, mode: DEV ? "dev" : "prod" }));

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role = "client", cityId = null } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });
    if (users.has(email)) return res.status(409).json({ message: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: seqId++, name, email, passwordHash, role, cityId, balance: 0 };
    users.set(email, user);
    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user: { id: user.id, name, email, role, cityId }, accessToken });
  } catch (e) { console.error(e); res.status(500).json({ message: "Register failed" }); }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = users.get(email);
    if (!user) return res.status(401).json({ message: "Wrong credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Wrong credentials" });
    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, cityId: user.cityId }, accessToken });
  } catch (e) { console.error(e); res.status(500).json({ message: "Login failed" }); }
});

app.post("/auth/refresh", (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh cookie" });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = [...users.values()].find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (e) { console.error(e); res.status(401).json({ message: "Invalid refresh" }); }
});

// --- Data ---
const CITIES = [{ id:1, name:"Dushanbe" }, { id:2, name:"Khujand" }];
const CATEGORIES = [
  { id: 1, name: "Сантехника", subcategories: [{ id: 11, name: "Краны" }] },
  { id: 2, name: "Электрика",  subcategories: [{ id: 21, name: "Розетки" }] },
  { id: 3, name: "Мебель и кухни", subcategories: [{ id: 31, name: "Сборка" }] },
];
const SERVICES = [
  { id: 101, title: "Замена смесителя", price: 80, currency: "сомони", image: "/placeholder.png", categoryId: 1, subCategoryId: 11 },
  { id: 102, title: "Монтаж розетки",  price: 40, currency: "сомони", image: "/placeholder.png", categoryId: 2, subCategoryId: 21 },
  { id: 103, title: "Сборка шкафа",    price: 60, currency: "сомони", image: "/placeholder.png", categoryId: 3, subCategoryId: 31 },
];
const MASTERS = Array.from({ length: 24 }).map((_, i) => {
  const id = i + 1;
  const categoryId = (i % 3) + 1;
  const subCategoryIds = categoryId === 1 ? [11] : categoryId === 2 ? [21] : [31];
  return {
    id,
    fullName: `Мастер №${id}`,
    avatar: "",
    rating: +(4 + (i % 10) / 10).toFixed(1),
    reviewsCount: 5 + (i % 30),
    priceFrom: 40 + (i % 5) * 10,
    phone: "+99290000000" + (i % 10),
    verified: i % 2 === 0,
    categoryId,
    subCategoryIds,
    cityId: (i % 2) + 1,
  };
});

// --- APIs ---
app.get("/cities", (_req, res) => res.json(CITIES));
app.get("/categories", (_req, res) => res.json(CATEGORIES));

app.get("/services", (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  let list = SERVICES.slice();
  if (categoryId)   list = list.filter(s => Number(s.categoryId)   === Number(categoryId));
  if (subCategoryId)list = list.filter(s => Number(s.subCategoryId)=== Number(subCategoryId));
  res.json(list);
});

app.get("/masters", (req, res) => {
  const { cityId, categoryId, subCategoryIds_like, q } = req.query;
  let list = MASTERS.slice();
  if (cityId)     list = list.filter(m => Number(m.cityId) === Number(cityId));
  if (categoryId) list = list.filter(m => Number(m.categoryId) === Number(categoryId));
  if (subCategoryIds_like) {
    const subId = Number(subCategoryIds_like);
    list = list.filter(m => Array.isArray(m.subCategoryIds) && m.subCategoryIds.includes(subId));
  }
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter(m => m.fullName.toLowerCase().includes(s));
  }
  res.json(list);
});

app.get("/masters/:id", (req, res) => {
  const id = Number(req.params.id);
  const m = MASTERS.find(x => x.id === id);
  if (!m) return res.status(404).json({ message: "Not found" });
  res.json(m);
});

// Моки под твой baseApi
app.get("/companies", (_req, res) => res.json([{ id: 1, name: "Company A" }]));
app.get("/orders", (_req, res) => res.json([{ id: 1, status: "new" }]));
app.get("/offers", (_req, res) => res.json([{ id: 1, orderId: 1, price: 100 }]));
app.get("/reviews", (_req, res) => res.json([{ id: 1, targetType: "master", targetId: 1, text: "Отлично!" }]));
app.get("/comments", (_req, res) => res.json([{ id: 1, text: "Комментарий" }]));
app.get("/users", (_req, res) => {
  res.json([...users.values()].map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, cityId: u.cityId })));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend on http://localhost:${PORT} (Express 5, no "*" routes)`);
});
