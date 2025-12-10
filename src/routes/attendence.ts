import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { markAttendanceController } from "../controllers/attendence/mark";
import { getAttendanceController } from "../controllers/attendence/get";
import { updateAttendanceController } from "../controllers/attendence/update";
import { getAllStudentsByClassController } from "../controllers/attendence/getAllStudentsByClass";

const router = Router();

router.post("/mark/:class_id", authenticate, markAttendanceController);
router.get("/get", authenticate, getAttendanceController)
router.patch("/update", authenticate, updateAttendanceController)
router.get("/getAll/:class_id", authenticate, getAllStudentsByClassController)

export default router;