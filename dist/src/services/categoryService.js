"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = require("../utils/db");
class CategoryService {
    static async createCategory(userId, data) {
        return await db_1.prisma.category.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    static async getCategories(userId) {
        return await db_1.prisma.category.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
            orderBy: { name: "asc" },
        });
    }
    static async getCategoryById(userId, categoryId) {
        return await db_1.prisma.category.findFirst({
            where: { id: categoryId, userId },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
        });
    }
    static async updateCategory(userId, categoryId, data) {
        return await db_1.prisma.category.update({
            where: { id: categoryId, userId },
            data,
        });
    }
    static async deleteCategory(userId, categoryId) {
        // First, set categoryId to null for all tasks in this category
        await db_1.prisma.task.updateMany({
            where: { categoryId, userId },
            data: { categoryId: null },
        });
        // Then delete the category
        return await db_1.prisma.category.delete({
            where: { id: categoryId, userId },
        });
    }
}
exports.CategoryService = CategoryService;
