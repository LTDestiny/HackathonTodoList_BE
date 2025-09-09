import { prisma } from "../utils/db";
import {
  TaskCreateInput,
  TaskUpdateInput,
  TaskQueryInput,
} from "../schemas/task";

export class TaskService {
  static async createTask(userId: string, data: TaskCreateInput) {
    return await prisma.task.create({
      data: {
        ...data,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  static async getTasks(userId: string, query: TaskQueryInput) {
    const {
      page,
      limit,
      search,
      category,
      priority,
      status,
      sortBy,
      sortOrder,
    } = query;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (priority) {
      where.priority = priority;
    }

    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    if (sortBy === "priority") {
      orderBy.priority = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getTaskById(userId: string, taskId: string) {
    return await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: {
        category: true,
      },
    });
  }

  static async updateTask(
    userId: string,
    taskId: string,
    data: TaskUpdateInput
  ) {
    const updateData: any = { ...data };

    // If status is being changed to COMPLETED, set completedAt
    if (data.status === "COMPLETED") {
      updateData.completedAt = new Date();
    } else if (
      data.status &&
      (data.status === "INCOMPLETE" || data.status === "IN_PROGRESS")
    ) {
      updateData.completedAt = null;
    }

    return await prisma.task.update({
      where: { id: taskId, userId },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  static async deleteTask(userId: string, taskId: string) {
    return await prisma.task.delete({
      where: { id: taskId, userId },
    });
  }

  static async updateTaskStatus(
    userId: string,
    taskId: string,
    status: string
  ) {
    const updateData: any = { status };

    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    return await prisma.task.update({
      where: { id: taskId, userId },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  // Smart feature: Auto-sort tasks by urgency
  static async getTasksByUrgency(userId: string) {
    const now = new Date();

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: { not: "COMPLETED" },
      },
      include: {
        category: true,
      },
    });

    // Sort by urgency: overdue -> high priority -> medium -> low
    return tasks.sort((a, b) => {
      // Check if overdue
      const aOverdue = a.deadlineAt && a.deadlineAt < now;
      const bOverdue = b.deadlineAt && b.deadlineAt < now;

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // If both overdue or neither overdue, sort by priority
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If same priority, sort by deadline
      if (a.deadlineAt && b.deadlineAt) {
        return a.deadlineAt.getTime() - b.deadlineAt.getTime();
      }

      if (a.deadlineAt && !b.deadlineAt) return -1;
      if (!a.deadlineAt && b.deadlineAt) return 1;

      // Finally, sort by creation date
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  // Smart feature: Suggest deadline based on priority and estimate
  static suggestDeadline(priority: string, estimateMinutes?: number) {
    const now = new Date();
    let daysToAdd = 7; // default

    switch (priority) {
      case "HIGH":
        daysToAdd = estimateMinutes && estimateMinutes > 120 ? 3 : 1;
        break;
      case "MEDIUM":
        daysToAdd = estimateMinutes && estimateMinutes > 240 ? 7 : 3;
        break;
      case "LOW":
        daysToAdd = estimateMinutes && estimateMinutes > 480 ? 14 : 7;
        break;
    }

    const suggestedDate = new Date(now);
    suggestedDate.setDate(suggestedDate.getDate() + daysToAdd);

    return suggestedDate;
  }
}
