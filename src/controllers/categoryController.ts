import { Response } from "express";
import { CategoryService } from "../services/categoryService";
import {
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from "../schemas/category";
import { AuthRequest } from "../middlewares/auth";

export class CategoryController {
  static async createCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const validatedData = CategoryCreateSchema.parse(req.body);
      const category = await CategoryService.createCategory(
        userId,
        validatedData
      );

      res.status(201).json({
        message: "Tạo danh mục thành công",
        category,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async getCategories(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const categories = await CategoryService.getCategories(userId);

      res.json({ categories });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getCategoryById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(userId, id);

      if (!category) {
        return res.status(404).json({ error: "Không tìm thấy danh mục" });
      }

      res.json({ category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validatedData = CategoryUpdateSchema.parse(req.body);
      const category = await CategoryService.updateCategory(
        userId,
        id,
        validatedData
      );

      res.json({
        message: "Cập nhật danh mục thành công",
        category,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Không tìm thấy danh mục" });
      }
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCategory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await CategoryService.deleteCategory(userId, id);

      res.json({ message: "Xóa danh mục thành công" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Không tìm thấy danh mục" });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
