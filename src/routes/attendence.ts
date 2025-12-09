import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { markAttendanceController } from "../controllers/attendence/mark";
import { getAttendanceController } from "../controllers/attendence/get";

const router = Router();

router.post("/mark", authenticate, markAttendanceController);
router.get("/get", authenticate, getAttendanceController)

export default router;