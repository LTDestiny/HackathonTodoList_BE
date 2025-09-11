"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const taskService_1 = require("../services/taskService");
const task_1 = require("../schemas/task");
class TaskController {
    static async createTask(req, res) {
        try {
            const userId = req.user.id;
            const validatedData = task_1.TaskCreateSchema.parse(req.body);
            const task = await taskService_1.TaskService.createTask(userId, validatedData);
            res.status(201).json({
                message: "Tạo nhiệm vụ thành công",
                task,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getTasks(req, res) {
        try {
            const userId = req.user.id;
            const validatedQuery = task_1.TaskQuerySchema.parse(req.query);
            const result = await taskService_1.TaskService.getTasks(userId, validatedQuery);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getTaskById(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const task = await taskService_1.TaskService.getTaskById(userId, id);
            if (!task) {
                return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
            }
            res.json({ task });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateTask(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const validatedData = task_1.TaskUpdateSchema.parse(req.body);
            const task = await taskService_1.TaskService.updateTask(userId, id, validatedData);
            res.json({
                message: "Cập nhật nhiệm vụ thành công",
                task,
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
            }
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteTask(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await taskService_1.TaskService.deleteTask(userId, id);
            res.json({ message: "Xóa nhiệm vụ thành công" });
        }
        catch (error) {
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
            }
            res.status(400).json({ error: error.message });
        }
    }
    static async updateTaskStatus(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { status } = task_1.TaskStatusUpdateSchema.parse(req.body);
            const task = await taskService_1.TaskService.updateTaskStatus(userId, id, status);
            res.json({
                message: "Cập nhật trạng thái thành công",
                task,
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
            }
            res.status(400).json({ error: error.message });
        }
    }
    static async getTasksByUrgency(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await taskService_1.TaskService.getTasksByUrgency(userId);
            res.json({ tasks });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async suggestDeadline(req, res) {
        try {
            const { priority, estimateMinutes } = req.query;
            if (!priority ||
                !["HIGH", "MEDIUM", "LOW"].includes(priority)) {
                return res
                    .status(400)
                    .json({
                    error: "Priority là bắt buộc và phải là HIGH, MEDIUM, hoặc LOW",
                });
            }
            const estimate = estimateMinutes
                ? parseInt(estimateMinutes)
                : undefined;
            const suggestedDeadline = taskService_1.TaskService.suggestDeadline(priority, estimate);
            res.json({
                suggestedDeadline: suggestedDeadline.toISOString(),
                message: "Đề xuất deadline dựa trên độ ưu tiên và thời gian ước tính",
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.TaskController = TaskController;
