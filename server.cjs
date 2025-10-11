// server.cjs
// Запуск: node server.cjs
// ENV: NODE_ENV=development PORT=4000 JWT_SECRET=super_secret

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

/* ---------------- CORS ---------------- */
const STATIC_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3003",
  "http://127.0.0.1:3003",
  "http://localhost:3004",
  "http://127.0.0.1:3004",
  "http://localhost:3005",
  "http://127.0.0.1:3005",
  "https://tamirtj-uiff.vercel.app",
  "https://tamirtj-mu.vercel.app",
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

// Express 5: preflight вручную
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    return res.sendStatus(204);
  }
  next();
});

/* ---------------- COMMON ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- In-Memory DB ---------------- */
const users = new Map(); // email -> user
let seqId = 1;

const orders = []; // { id, userId, categoryId, subCategoryId, cityId, phone, description, status, createdAt }
let orderSeq = 1;
const nextOrderId = () => String(orderSeq++);

const threads = [];  // { id, userId, masterId, lastTs, lastMessage }
const messages = []; // { id, threadId, from, text, createdAt }
let threadSeq = 1;
let messageSeq = 1;

function nowISO() { return new Date().toISOString(); }
function nextThreadId() { return String(threadSeq++); }
function nextMessageId() { return String(messageSeq++); }

/* ---------------- JWT helpers ---------------- */
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

function authRequired(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function authFromHeader(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    const user = [...users.values()].find(u => u.id === payload.id);
    return user || null;
  } catch {
    return null;
  }
}

let masterSeq = 1000; // старт c 1000, чтобы не пересекаться с seed
function nextMasterId() { return ++masterSeq; }


/* ---------------- DATA ---------------- */
const CITIES = [
  { id: 1, name: "Dushanbe" },
  { id: 2, name: "Khujand" },
  { id: 3, name: "Bokhtar" },
  { id: 4, name: "Kulob" },
];

const CATEGORIES = [
  { id: 1, name: "Сантехника", subcategories: [
    { id: 11, name: "Краны" },
    { id: 12, name: "Унитазы" },
    { id: 13, name: "Стиральные машины" },
    { id: 14, name: "Водонагреватели" },
  ]},
  { id: 2, name: "Электрика", subcategories: [
    { id: 21, name: "Розетки" },
    { id: 22, name: "Освещение" },
    { id: 23, name: "Проводка" },
    { id: 24, name: "Щиток" },
  ]},
  { id: 3, name: "Мебель и кухни", subcategories: [
    { id: 31, name: "Сборка" },
    { id: 32, name: "Установка кухни" },
    { id: 33, name: "Ремонт мебели" },
  ]},
  { id: 4, name: "Отопление", subcategories: [
    { id: 41, name: "Радиаторы" },
    { id: 42, name: "Котлы" },
    { id: 43, name: "Тёплый пол" },
  ]},
  { id: 5, name: "Кондиционеры", subcategories: [
    { id: 51, name: "Монтаж" },
    { id: 52, name: "Заправка" },
    { id: 53, name: "Диагностика" },
  ]},
  // Новая категория
  { id: 6, name: "Автосервис", subcategories: [
    { id: 61, name: "ТО и замена масла" },
    { id: 62, name: "Тормоза" },
    { id: 63, name: "Подвеска" },
    { id: 64, name: "Шиномонтаж" },
    { id: 65, name: "Автоэлектрика" },
    { id: 66, name: "Кондиционер" },
  ]},
];

// УСЛУГИ (Unsplash изображения)
const SERVICES = [
  // Сантехника
  { id:101, title:"Замена смесителя", price:120, currency:"сомони", image:"https://images.unsplash.com/photo-1602045486350-48134c8f2a41?q=80&w=1200&auto=format&fit=crop", categoryId:1, subCategoryId:11 },
  { id:102, title:"Устранение протечки", price:100, currency:"сомони", image:"https://images.unsplash.com/photo-1610526526921-9f1f5e1efc3b?q=80&w=1200&auto=format&fit=crop", categoryId:1, subCategoryId:11 },
  { id:103, title:"Установка унитаза", price:250, currency:"сомони", image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop", categoryId:1, subCategoryId:12 },
  { id:104, title:"Подключение стиральной машины", price:150, currency:"сомони", image:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop", categoryId:1, subCategoryId:13 },
  { id:105, title:"Монтаж водонагревателя", price:300, currency:"сомони", image:"https://images.unsplash.com/photo-1604882736460-3ee25c74cf64?q=80&w=1200&auto=format&fit=crop", categoryId:1, subCategoryId:14 },

  // Электрика
  { id:201, title:"Монтаж розетки/выключателя", price:40, currency:"сомони", image:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop", categoryId:2, subCategoryId:21 },
  { id:202, title:"Установка/замена светильника", price:80, currency:"сомони", image:"https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop", categoryId:2, subCategoryId:22 },
  { id:203, title:"Прокладка кабеля (м.п.)", price:8, currency:"сомони", image:"https://images.unsplash.com/photo-1563986768449-24cebce3c64a?q=80&w=1200&auto=format&fit=crop", categoryId:2, subCategoryId:23 },
  { id:204, title:"Сборка электрощитка", price:350, currency:"сомони", image:"https://images.unsplash.com/photo-1560421683-d87c2f5f9c6f?q=80&w=1200&auto=format&fit=crop", categoryId:2, subCategoryId:24 },

  // Мебель
  { id:301, title:"Сборка шкафа-купе", price:300, currency:"сомони", image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop", categoryId:3, subCategoryId:31 },
  { id:302, title:"Установка кухни (п.м.)", price:120, currency:"сомони", image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop", categoryId:3, subCategoryId:32 },
  { id:303, title:"Ремонт мебели (час)", price:60, currency:"somoni", image:"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop", categoryId:3, subCategoryId:33 },

  // Отопление
  { id:401, title:"Монтаж радиатора", price:220, currency:"сомони", image:"https://images.unsplash.com/photo-1586732314077-45f5cb2cd1b8?q=80&w=1200&auto=format&fit=crop", categoryId:4, subCategoryId:41 },
  { id:402, title:"Обвязка котла", price:600, currency:"сомони", image:"https://images.unsplash.com/photo-1616400619175-5beda8095f24?q=80&w=1200&auto=format&fit=crop", categoryId:4, subCategoryId:42 },

  // Кондиционеры
  { id:501, title:"Монтаж кондиционера (до 2.5 кВт)", price:600, currency:"сомони", image:"https://images.unsplash.com/photo-1612174527155-8c47e1e0fce0?q=80&w=1200&auto=format&fit=crop", categoryId:5, subCategoryId:51 },
  { id:502, title:"Заправка фреоном", price:250, currency:"сомони", image:"https://images.unsplash.com/photo-1607920591413-4e7b1f7c7c10?q=80&w=1200&auto=format&fit=crop", categoryId:5, subCategoryId:52 },
  { id:503, title:"Диагностика кондиционера", price:100, currency:"сомони", image:"https://images.unsplash.com/photo-1590418604973-671a4d7a2d52?q=80&w=1200&auto=format&fit=crop", categoryId:5, subCategoryId:53 },

  // Автосервис
  { id:601, title:"ТО и замена масла (работа)", price:120, currency:"сомони", image:"https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:61 },
  { id:602, title:"Замена тормозных колодок (ось)", price:220, currency:"сомони", image:"https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:62 },
  { id:603, title:"Ремонт/диагностика подвески (час)", price:100, currency:"сомони", image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:63 },
  { id:604, title:"Шиномонтаж (колесо R13–R16)", price:30,  currency:"сомони", image:"https://images.unsplash.com/photo-1613645818950-69b8d6cd9592?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:64 },
  { id:605, title:"Диагностика автоэлектрики",     price:150, currency:"сомони", image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6c?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:65 },
  { id:606, title:"Заправка кондиционера авто",     price:180, currency:"сомони", image:"https://images.unsplash.com/photo-1627024514312-1b8a88807eee?q=80&w=1200&auto=format&fit=crop", categoryId:6, subCategoryId:66 },
];

// МАСТЕРА (randomuser.me)
const MASTERS = [
  // Сантехника
  { id:1, fullName:"Сухроб Абдуллоев", avatar:"https://randomuser.me/api/portraits/men/32.jpg", rating:4.7, reviewsCount:26, priceFrom:80, phone:"+992900000001", verified:true,  categoryId:1, subCategoryIds:[11,12,13], cityId:1 },
  { id:2, fullName:"Нилуфар Расулова", avatar:"https://randomuser.me/api/portraits/women/44.jpg", rating:4.8, reviewsCount:31, priceFrom:90, phone:"+992900000002", verified:true,  categoryId:1, subCategoryIds:[11,14], cityId:1 },
  { id:3, fullName:"Фируз Шарипов",   avatar:"https://randomuser.me/api/portraits/men/12.jpg", rating:4.5, reviewsCount:18, priceFrom:70, phone:"+992900000003", verified:false, categoryId:1, subCategoryIds:[12,13], cityId:2 },

  // Электрика
  { id:4, fullName:"Мунир Кориров",   avatar:"https://randomuser.me/api/portraits/men/83.jpg", rating:4.9, reviewsCount:42, priceFrom:50, phone:"+992900000004", verified:true,  categoryId:2, subCategoryIds:[21,22,24], cityId:1 },
  { id:5, fullName:"Зарина Хамидова", avatar:"https://randomuser.me/api/portraits/women/65.jpg", rating:4.6, reviewsCount:23, priceFrom:45, phone:"+992900000005", verified:true,  categoryId:2, subCategoryIds:[21,22], cityId:3 },
  { id:6, fullName:"Алишер Рахматов", avatar:"https://randomuser.me/api/portraits/men/7.jpg",  rating:4.4, reviewsCount:17, priceFrom:40, phone:"+992900000006", verified:false, categoryId:2, subCategoryIds:[23], cityId:2 },

  // Мебель
  { id:7, fullName:"Давлат Бобоев",   avatar:"https://randomuser.me/api/portraits/men/51.jpg", rating:4.7, reviewsCount:28, priceFrom:60, phone:"+992900000007", verified:true,  categoryId:3, subCategoryIds:[31,33], cityId:1 },
  { id:8, fullName:"Саида Гулмамадова", avatar:"https://randomuser.me/api/portraits/women/39.jpg", rating:4.5, reviewsCount:19, priceFrom:70, phone:"+992900000008", verified:false, categoryId:3, subCategoryIds:[32], cityId:4 },

  // Отопление
  { id:9,  fullName:"Фарход Муродов", avatar:"https://randomuser.me/api/portraits/men/41.jpg", rating:4.6, reviewsCount:21, priceFrom:120, phone:"+992900000009", verified:true,  categoryId:4, subCategoryIds:[41,42], cityId:1 },
  { id:10, fullName:"Манижа Сафарова", avatar:"https://randomuser.me/api/portraits/women/28.jpg", rating:4.3, reviewsCount:14, priceFrom:110, phone:"+992900000010", verified:false, categoryId:4, subCategoryIds:[41,43], cityId:2 },

  // Кондиционеры
  { id:11, fullName:"Бахтиёр Юсуфов", avatar:"https://randomuser.me/api/portraits/men/14.jpg", rating:4.8, reviewsCount:33, priceFrom:150, phone:"+992900000011", verified:true,  categoryId:5, subCategoryIds:[51,52,53], cityId:1 },
  { id:12, fullName:"Мехрибон Набиева", avatar:"https://randomuser.me/api/portraits/women/22.jpg", rating:4.6, reviewsCount:24, priceFrom:130, phone:"+992900000012", verified:true,  categoryId:5, subCategoryIds:[52,53], cityId:3 },

  // Автосервис
  { id:13, fullName:"Рустам Каримов", avatar:"https://randomuser.me/api/portraits/men/25.jpg", rating:4.7, reviewsCount:29, priceFrom:120, phone:"+992900000013", verified:true,  categoryId:6, subCategoryIds:[61,62], cityId:1 },
  { id:14, fullName:"Шодиха Абдуллозода", avatar:"https://randomuser.me/api/portraits/women/47.jpg", rating:4.8, reviewsCount:34, priceFrom:140, phone:"+992900000014", verified:true,  categoryId:6, subCategoryIds:[61,66], cityId:1 },
  { id:15, fullName:"Абдурахмон Носиров", avatar:"https://randomuser.me/api/portraits/men/36.jpg", rating:4.5, reviewsCount:18, priceFrom:100, phone:"+992900000015", verified:false, categoryId:6, subCategoryIds:[63,64], cityId:2 },
  { id:16, fullName:"Хушнуд Файзиев", avatar:"https://randomuser.me/api/portraits/men/68.jpg", rating:4.6, reviewsCount:22, priceFrom:150, phone:"+992900000016", verified:true,  categoryId:6, subCategoryIds:[65], cityId:3 },
  { id:17, fullName:"Мехрубон Юлдашев", avatar:"https://randomuser.me/api/portraits/men/73.jpg", rating:4.4, reviewsCount:15, priceFrom:90,  phone:"+992900000017", verified:false, categoryId:6, subCategoryIds:[64,62], cityId:4 },
  { id:18, fullName:"Заррина Саидова", avatar:"https://randomuser.me/api/portraits/women/53.jpg", rating:4.7, reviewsCount:27, priceFrom:160, phone:"+992900000018", verified:true,  categoryId:6, subCategoryIds:[66,65], cityId:1 },
];

/* ---------------- Seed chat ---------------- */
(function seedChat() {
  const t1 = { id: nextThreadId(), userId: "1", masterId: 4, lastTs: nowISO(), lastMessage: "Здравствуйте! Чем могу помочь?" };
  threads.push(t1);
  messages.push(
    { id: nextMessageId(), threadId: t1.id, from: "master", text: "Здравствуйте! Чем могу помочь?", createdAt: nowISO() },
    { id: nextMessageId(), threadId: t1.id, from: "user",   text: "Нужно установить розетку в кухне.", createdAt: nowISO() },
  );
  t1.lastTs = messages[messages.length - 1].createdAt;
  t1.lastMessage = messages[messages.length - 1].text;

  const t2 = { id: nextThreadId(), userId: "1", masterId: 1, lastTs: nowISO(), lastMessage: "Добрый день! По сантехнике свободен сегодня." };
  threads.push(t2);
  messages.push({ id: nextMessageId(), threadId: t2.id, from: "master", text: "Добрый день! По сантехнике свободен сегодня.", createdAt: nowISO() });
})();

/* ---------------- ROUTES ---------------- */
app.get("/health", (_req, res) => res.json({ ok: true, mode: DEV ? "dev" : "prod" }));

// AUTH
app.post("/auth/register", async (req, res) => {
  try {
    let { name, email, password, role = "user", cityId = null } = req.body || {};

    // Нормализация
    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();
    password = String(password || "");
    role = String(role || "user").trim().toLowerCase();
    if (role === "client") role = "user";
    const ALLOWED = new Set(["user", "master", "admin"]);
    if (!ALLOWED.has(role)) role = "user";

    // Валидация
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    // Уже есть?
    if (users.has(email)) {
      return res.status(409).json({ message: "Email already used" });
    }

    // Создание
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: seqId++, name, email, passwordHash, role, cityId: cityId ?? null, balance: 0 };
    users.set(email, user);

    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, cityId: user.cityId },
      accessToken
    });
  } catch (e) {
    console.error("Register failed:", e?.message, e);
    return res.status(500).json({ message: "Register failed" });
  }
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
    const user = [...users.values()].find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);

    res.json({ accessToken });
  } catch (e) { console.error(e); res.status(401).json({ message: "Invalid refresh" }); }
});



app.get("/auth/me", (req, res) => {
  const user = authFromHeader(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, cityId: user.cityId } });
});

// POST /auth/logout — очистить refresh cookie
app.post("/auth/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: DEV ? false : true,
    sameSite: DEV ? "lax" : "none",
    path: "/",
  });
  return res.sendStatus(204);
});

app.post("/orders", (req, res) => {
  const { userId, categoryId, subCategoryId, cityId, phone, description } = req.body || {};
  if (!categoryId || !cityId || !phone || !description) {
    return res.status(400).json({ message: "categoryId, cityId, phone, description required" });
  }
  const o = {
    id: nextOrderId(),
    userId: userId ? String(userId) : null, // можно пустым, если нет авторизации
    categoryId: Number(categoryId),
    subCategoryId: subCategoryId ? Number(subCategoryId) : null,
    cityId: Number(cityId),
    phone: String(phone),
    description: String(description).trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  orders.push(o);
  res.status(201).json(o);
});

// DICTS
app.get("/cities", (_req, res) => res.json(CITIES));
app.get("/categories", (_req, res) => res.json(CATEGORIES));

// SERVICES
app.get("/services", (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  let list = SERVICES.slice();
  if (categoryId)    list = list.filter(s => Number(s.categoryId)    === Number(categoryId));
  if (subCategoryId) list = list.filter(s => Number(s.subCategoryId) === Number(subCategoryId));
  res.json(list);
});


app.get("/orders", (req, res) => {
  let list = orders.slice();
  const { userId } = req.query;
  if (userId != null) list = list.filter(o => String(o.userId) === String(userId));
  // для совместимости можно вернуть пустую, если нет — просто отдадим list
  res.json(list);
});

// MASTERS
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

// CHAT (threads & messages)
app.get("/threads", (req, res) => {
  let list = threads.slice();
  const { userId, _sort, _order } = req.query;
  if (userId != null) list = list.filter(t => String(t.userId) === String(userId));
  if (_sort === "lastTs") {
    list.sort((a, b) => new Date(a.lastTs) - new Date(b.lastTs));
    if ((_order || "").toLowerCase() === "desc") list.reverse();
  }
  res.json(list);
});

app.get("/threads/:id", (req, res) => {
  const id = String(req.params.id);
  const t = threads.find(x => String(x.id) === id);
  if (!t) return res.status(404).json({ message: "Thread not found" });
  res.json(t);
});

app.post("/threads", (req, res) => {
  const { userId, peerId } = req.body || {};
  if (!userId || !peerId) return res.status(400).json({ message: "userId and peerId required" });
  const id = nextThreadId();
  const t = { id, userId: String(userId), masterId: Number(peerId), lastTs: nowISO(), lastMessage: "" };
  threads.push(t);
  res.status(201).json(t);
});

app.get("/messages", (req, res) => {
  const { threadId, _sort, _order } = req.query;
  if (!threadId) return res.status(400).json({ message: "threadId required" });
  let list = messages.filter(m => String(m.threadId) === String(threadId));
  if (_sort === "createdAt") {
    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if ((_order || "").toLowerCase() === "desc") list.reverse();
  }
  res.json(list);
});

// Получить мою карточку мастера по access token
app.get("/masters/me", authRequired, (req, res) => {
  const me = [...users.values()].find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ message: "User not found" });
  if (me.role !== "master") return res.status(403).json({ message: "Not a master" });
  const card = MASTERS.find(m => m.userId === me.id);
  if (!card) return res.status(404).json({ message: "Master card not found" });
  res.json(card);
});

// Обновить мою карточку мастера (простая версия)
app.patch("/masters/me", authRequired, (req, res) => {
  const me = [...users.values()].find(u => u.id === req.user.id);
  if (!me) return res.status(404).json({ message: "User not found" });
  if (me.role !== "master") return res.status(403).json({ message: "Not a master" });
  const card = MASTERS.find(m => m.userId === me.id);
  if (!card) return res.status(404).json({ message: "Master card not found" });

  const allowed = ["fullName","avatar","priceFrom","phone","verified","categoryId","subCategoryIds","cityId"];
  for (const k of allowed) if (k in req.body) card[k] = req.body[k];
  res.json(card);
});


app.post("/messages", (req, res) => {
  const { threadId, from, text } = req.body || {};
  if (!threadId || !from || !text) return res.status(400).json({ message: "threadId, from, text required" });
  const t = threads.find(x => String(x.id) === String(threadId));
  if (!t) return res.status(404).json({ message: "Thread not found" });
  const msg = { id: nextMessageId(), threadId: String(threadId), from, text, createdAt: nowISO() };
  messages.push(msg);
  t.lastTs = msg.createdAt;
  t.lastMessage = msg.text;
  res.status(201).json(msg);
});

// прочие заглушки
app.get("/companies", (_req, res) => res.json([{ id: 1, name: "Company A" }]));
app.get("/orders", (_req, res) => res.json([{ id: 1, status: "new" }]));
app.get("/offers", (_req, res) => res.json([{ id: 1, orderId: 1, price: 100 }]));
app.get("/reviews", (_req, res) => res.json([{ id: 1, targetType: "master", targetId: 1, text: "Отлично!" }]));
app.get("/comments", (_req, res) => res.json([{ id: 1, text: "Комментарий" }]));
app.get("/users", (_req, res) => {
  const list = [...users.values()].map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, cityId: u.cityId }));
  res.json(list);
});

/* ---------------- START ---------------- */
const BASE = Number(PORT);
function start(port, attempt = 0) {
  const srv = app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Backend on http://localhost:${port} (Express 5, CORS ok)`);
  });
  srv.on("error", (err) => {
    if (err.code === "EADDRINUSE" && attempt < 10) {
      const next = port + 1;
      console.warn(`⚠️  Port ${port} in use, trying ${next}...`);
      start(next, attempt + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}
start(BASE);
