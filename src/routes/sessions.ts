import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createSessionController } from "../controllers/sessions/create";

const router = Router();

router.post("/create", authenticate, createSessionController);

export default router;