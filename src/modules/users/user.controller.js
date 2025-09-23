import { prisma } from "../../db.js";
import { updateUserSchema } from "./user.schema.js";

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, balance: true, createdAt: true }
    });
    res.json(user);
  } catch (e) { next(e); }
};

export const list = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, balance: true }
    });
    res.json(users);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: +req.params.id }, data });
    res.json(user);
  } catch (e) { next(e); }
};
