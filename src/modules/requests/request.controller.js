import { prisma } from "../../db.js";
import { createRequestSchema } from "./request.schema.js";

export const createRequest = async (req, res, next) => {
  try {
    const data = createRequestSchema.parse(req.body);
    const reqRow = await prisma.request.create({
      data: { ...data, clientId: req.user.id }
    });
    res.status(201).json(reqRow);
  } catch (e) { next(e); }
};

export const myRequests = async (req, res, next) => {
  try {
    const list = await prisma.request.findMany({
      where: { clientId: req.user.id },
      orderBy: { createdAt: "desc" }
    });
    res.json(list);
  } catch (e) { next(e); }
};
