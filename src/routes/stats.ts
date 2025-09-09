import { Router } from "express";
import { StatsController } from "../controllers/statsController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", StatsController.getUserStats);

export default router;
