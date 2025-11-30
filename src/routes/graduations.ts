import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createGraduationController } from "../controllers/graduations/create";

const router = Router();

router.post("/create", authenticate, createGraduationController);

export default router;
