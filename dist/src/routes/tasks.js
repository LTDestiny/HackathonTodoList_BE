"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get("/", taskController_1.TaskController.getTasks);
router.post("/", taskController_1.TaskController.createTask);
router.get("/urgency", taskController_1.TaskController.getTasksByUrgency);
router.get("/suggest-deadline", taskController_1.TaskController.suggestDeadline);
router.get("/:id", taskController_1.TaskController.getTaskById);
router.put("/:id", taskController_1.TaskController.updateTask);
router.delete("/:id", taskController_1.TaskController.deleteTask);
router.patch("/:id/status", taskController_1.TaskController.updateTaskStatus);
exports.default = router;
