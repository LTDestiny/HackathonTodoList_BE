import { prisma } from "../utils/db";
import { CategoryCreateInput, CategoryUpdateInput } from "../schemas/category";

export class CategoryService {
  static async createCategory(userId: string, data: CategoryCreateInput) {
    return await prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async getCategories(userId: string) {
    return await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getCategoryById(userId: string, categoryId: string) {
    return await prisma.category.findFirst({
      where: { id: categoryId, userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  static async updateCategory(
    userId: string,
    categoryId: string,
    data: CategoryUpdateInput
  ) {
    return await prisma.category.update({
      where: { id: categoryId, userId },
      data,
    });
  }

  static async deleteCategory(userId: string, categoryId: string) {
    // First, set categoryId to null for all tasks in this category
    await prisma.task.updateMany({
      where: { categoryId, userId },
      data: { categoryId: null },
    });

    // Then delete the category
    return await prisma.category.delete({
      where: { id: categoryId, userId },
    });
  }
}
