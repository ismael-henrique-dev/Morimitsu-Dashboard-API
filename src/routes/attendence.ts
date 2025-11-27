import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { markAttendanceController } from "../controllers/attendence/mark";

const router = Router();

router.post("/mark", authenticate, markAttendanceController);

export default router;