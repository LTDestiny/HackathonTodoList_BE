import { prisma } from "../utils/db";

export class StatsService {
  static async getUserStats(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      weeklyCompleted,
      monthlyCompleted,
      categoryStats,
      priorityStats,
      recentActivity,
    ] = await Promise.all([
      // Total tasks
      prisma.task.count({ where: { userId } }),

      // Completed tasks
      prisma.task.count({ where: { userId, status: "COMPLETED" } }),

      // In progress tasks
      prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),

      // Overdue tasks
      prisma.task.count({
        where: {
          userId,
          status: { not: "COMPLETED" },
          deadlineAt: { lt: now },
        },
      }),

      // Weekly completed tasks
      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          completedAt: { gte: startOfWeek },
        },
      }),

      // Monthly completed tasks
      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          completedAt: { gte: startOfMonth },
        },
      }),

      // Category statistics
      prisma.category.findMany({
        where: { userId },
        include: {
          _count: {
            select: {
              tasks: {
                where: { status: "COMPLETED" },
              },
            },
          },
        },
      }),

      // Priority statistics
      prisma.task.groupBy({
        by: ["priority"],
        where: { userId },
        _count: { _all: true },
      }),

      // Recent activity (last 7 days)
      prisma.task.findMany({
        where: {
          userId,
          OR: [
            {
              completedAt: {
                gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
              },
            },
            {
              createdAt: {
                gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),
    ]);

    // Daily completion data for the last 7 days
    const dailyStats = await this.getDailyCompletionStats(userId, 7);

    return {
      overview: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      weekly: {
        completedTasks: weeklyCompleted,
      },
      monthly: {
        completedTasks: monthlyCompleted,
      },
      categories: categoryStats.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        completedTasks: cat._count.tasks,
      })),
      priorities: priorityStats.map((stat) => ({
        priority: stat.priority,
        count: stat._count._all,
      })),
      dailyCompletion: dailyStats,
      recentActivity,
    };
  }

  private static async getDailyCompletionStats(userId: string, days: number) {
    const stats = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const completed = await prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          completedAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      stats.push({
        date: startOfDay.toISOString().split("T")[0],
        completed,
      });
    }

    return stats;
  }
}
