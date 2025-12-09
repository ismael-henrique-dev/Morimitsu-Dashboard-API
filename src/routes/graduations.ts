import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { createGraduationController } from "../controllers/graduations/create";
import { getGraduationsController } from "../controllers/graduations/get";

const router = Router();

router.post("/create/:id", authenticate, createGraduationController);
router.get("/get/:studentId", authenticate, getGraduationsController )

export default router;
