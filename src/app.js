import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import requestRoutes from "./modules/requests/request.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

app.use(errorHandler);
export default app;
