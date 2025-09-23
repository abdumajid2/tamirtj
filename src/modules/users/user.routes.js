import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { me, list, update } from "./user.controller.js";

const r = Router();

r.get("/me", auth(), me);                 // любой авторизованный
r.get("/", auth(["admin"]), list);        // только админ
r.patch("/:id", auth(["admin"]), update); // только админ

export default r;
