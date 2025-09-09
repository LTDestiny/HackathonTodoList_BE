import { Response } from "express";
import { TaskService } from "../services/taskService";
import {
  TaskCreateSchema,
  TaskUpdateSchema,
  TaskStatusUpdateSchema,
  TaskQuerySchema,
} from "../schemas/task";
import { AuthRequest } from "../middlewares/auth";

export class TaskController {
  static async createTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const validatedData = TaskCreateSchema.parse(req.body);
      const task = await TaskService.createTask(userId, validatedData);

      res.status(201).json({
        message: "Tạo nhiệm vụ thành công",
        task,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const validatedQuery = TaskQuerySchema.parse(req.query);
      const result = await TaskService.getTasks(userId, validatedQuery);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTaskById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await TaskService.getTaskById(userId, id);

      if (!task) {
        return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
      }

      res.json({ task });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validatedData = TaskUpdateSchema.parse(req.body);
      const task = await TaskService.updateTask(userId, id, validatedData);

      res.json({
        message: "Cập nhật nhiệm vụ thành công",
        task,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await TaskService.deleteTask(userId, id);

      res.json({ message: "Xóa nhiệm vụ thành công" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTaskStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = TaskStatusUpdateSchema.parse(req.body);
      const task = await TaskService.updateTaskStatus(userId, id, status);

      res.json({
        message: "Cập nhật trạng thái thành công",
        task,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async getTasksByUrgency(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const tasks = await TaskService.getTasksByUrgency(userId);

      res.json({ tasks });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async suggestDeadline(req: AuthRequest, res: Response) {
    try {
      const { priority, estimateMinutes } = req.query;

      if (
        !priority ||
        !["HIGH", "MEDIUM", "LOW"].includes(priority as string)
      ) {
        return res
          .status(400)
          .json({
            error: "Priority là bắt buộc và phải là HIGH, MEDIUM, hoặc LOW",
          });
      }

      const estimate = estimateMinutes
        ? parseInt(estimateMinutes as string)
        : undefined;
      const suggestedDeadline = TaskService.suggestDeadline(
        priority as string,
        estimate
      );

      res.json({
        suggestedDeadline: suggestedDeadline.toISOString(),
        message: "Đề xuất deadline dựa trên độ ưu tiên và thời gian ước tính",
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
