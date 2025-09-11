"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
const category_1 = require("../schemas/category");
class CategoryController {
    static async createCategory(req, res) {
        try {
            const userId = req.user.id;
            const validatedData = category_1.CategoryCreateSchema.parse(req.body);
            const category = await categoryService_1.CategoryService.createCategory(userId, validatedData);
            res.status(201).json({
                message: "Tạo danh mục thành công",
                category,
            });
        }
        catch (error) {
            if (error.code === "P2002") {
                return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
            }
            res.status(400).json({ error: error.message });
        }
    }
    static async getCategories(req, res) {
        try {
            const userId = req.user.id;
            const categories = await categoryService_1.CategoryService.getCategories(userId);
            res.json({ categories });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getCategoryById(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const category = await categoryService_1.CategoryService.getCategoryById(userId, id);
            if (!category) {
                return res.status(404).json({ error: "Không tìm thấy danh mục" });
            }
            res.json({ category });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateCategory(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const validatedData = category_1.CategoryUpdateSchema.parse(req.body);
            const category = await categoryService_1.CategoryService.updateCategory(userId, id, validatedData);
            res.json({
                message: "Cập nhật danh mục thành công",
                category,
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Không tìm thấy danh mục" });
            }
            if (error.code === "P2002") {
                return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
            }
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteCategory(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await categoryService_1.CategoryService.deleteCategory(userId, id);
            res.json({ message: "Xóa danh mục thành công" });
        }
        catch (error) {
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Không tìm thấy danh mục" });
            }
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
