import { Router } from "express";
import { TaskController } from "../controllers/taskController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", TaskController.getTasks);
router.post("/", TaskController.createTask);
router.get("/urgency", TaskController.getTasksByUrgency);
router.get("/suggest-deadline", TaskController.suggestDeadline);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.patch("/:id/status", TaskController.updateTaskStatus);

export default router;
