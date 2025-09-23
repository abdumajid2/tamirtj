import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exist = await prisma.user.findUnique({ where: { email: data.email } });
    if (exist) return res.status(409).json({ message: "Email already used" });

    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { ...data, password: hash, role: data.role || "client" }
    });

    res.status(201).json({ token: sign(user), user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ message: "Wrong credentials" });

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) return res.status(401).json({ message: "Wrong credentials" });

    res.json({ token: sign(user), user: { id: user.id, name: user.name, role: user.role } });
  } catch (e) { next(e); }
};
