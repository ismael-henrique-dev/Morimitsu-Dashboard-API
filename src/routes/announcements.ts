import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getGraduationAnnouncementsController } from "../controllers/announcements/graduations";
import { getBirthdayAnnouncementsController } from "../controllers/announcements/birthday";

const router = Router();

router.get("/graduations", authenticate, getGraduationAnnouncementsController);
router.get("/birthdays", authenticate, getBirthdayAnnouncementsController);

export default router;
