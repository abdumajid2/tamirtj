import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { createRequest, myRequests } from "./request.controller.js";
const r = Router();

r.post("/", auth(["client","master","admin"]), createRequest);
r.get("/my", auth(), myRequests);

export default r;
