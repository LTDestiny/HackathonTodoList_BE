import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu tạo dữ liệu mẫu...");

  // Tạo người dùng mẫu
  const passwordHash = await bcrypt.hash("123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "student@gmail.com" },
    update: {},
    create: {
      email: "student@gmail.com",
      fullName: "Nguyễn Văn An",
      passwordHash,
      role: "student",
    },
  });

  console.log("✅ Đã tạo người dùng:", user.email);

  // Tạo các danh mục
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "📚 Học tập" } },
      update: {},
      create: {
        userId: user.id,
        name: "📚 Học tập",
        color: "#3B82F6",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "🎭 Ngoại khóa" } },
      update: {},
      create: {
        userId: user.id,
        name: "🎭 Ngoại khóa",
        color: "#10B981",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "👤 Cá nhân" } },
      update: {},
      create: {
        userId: user.id,
        name: "👤 Cá nhân",
        color: "#F59E0B",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "💼 Thực tập" } },
      update: {},
      create: {
        userId: user.id,
        name: "💼 Thực tập",
        color: "#8B5CF6",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "🏃‍♂️ Thể thao" } },
      update: {},
      create: {
        userId: user.id,
        name: "🏃‍♂️ Thể thao",
        color: "#EF4444",
      },
    }),
  ]);

  console.log("✅ Đã tạo danh mục:", categories.length);

  // Tạo các task mẫu đa dạng
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const tasks = await Promise.all([
    // Học tập - Ưu tiên cao, đang làm
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Hoàn thành bài tập Toán cao cấp - Chương 3",
        description:
          "Giải các bài tập từ 3.1 đến 3.15 về tích phân và ứng dụng. Chuẩn bị cho kiểm tra giữa kỳ.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        deadlineAt: tomorrow,
        estimateMinutes: 180,
      },
    }),

    // Học tập - Ưu tiên cao, quá hạn
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Nộp báo cáo thực hành Cơ sở dữ liệu",
        description:
          "Thiết kế và triển khai hệ thống quản lý thư viện với MySQL. Bao gồm ERD, database và queries.",
        priority: "HIGH",
        status: "INCOMPLETE",
        deadlineAt: yesterday,
        estimateMinutes: 300,
      },
    }),

    // Học tập - Hoàn thành
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Làm bài tập lập trình Web - React.js",
        description:
          "Tạo ứng dụng Todo App sử dụng React, Redux và Material-UI",
        priority: "MEDIUM",
        status: "COMPLETED",
        deadlineAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        estimateMinutes: 240,
      },
    }),

    // Học tập - Ôn thi
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Ôn tập môn Thuật toán và Cấu trúc dữ liệu",
        description:
          "Ôn lại các thuật toán sắp xếp, tìm kiếm, cây nhị phân, và graph. Làm bài tập trên LeetCode.",
        priority: "HIGH",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        estimateMinutes: 360,
      },
    }),

    // Học tập - Đọc tài liệu
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Đọc paper về Machine Learning",
        description:
          "Đọc và tóm tắt paper 'Deep Learning for Natural Language Processing' cho môn AI",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        deadlineAt: nextWeek,
        estimateMinutes: 150,
      },
    }),

    // Ngoại khóa - CLB
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[1].id,
        title: "Họp CLB Lập trình - Kế hoạch Hackathon",
        description:
          "Thảo luận kế hoạch tổ chức cuộc thi Hackathon 2024. Phân công nhiệm vụ và timeline.",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        estimateMinutes: 120,
      },
    }),

    // Ngoại khóa - Sự kiện
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[1].id,
        title: "Chuẩn bị presentation cho Tech Talk",
        description:
          "Chuẩn bị slides về 'Modern Web Development với React và TypeScript' cho buổi tech talk của CLB",
        priority: "HIGH",
        status: "IN_PROGRESS",
        deadlineAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        estimateMinutes: 180,
      },
    }),

    // Thực tập
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[3].id,
        title: "Hoàn thành dự án thực tập - Module thanh toán",
        description:
          "Phát triển module thanh toán online tích hợp VNPay và MoMo cho ứng dụng e-commerce",
        priority: "HIGH",
        status: "IN_PROGRESS",
        deadlineAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        estimateMinutes: 480,
      },
    }),

    // Thực tập - Báo cáo
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[3].id,
        title: "Viết báo cáo tuần thực tập",
        description:
          "Tổng kết công việc tuần này: API development, database optimization, code review",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        estimateMinutes: 90,
      },
    }),

    // Cá nhân - Sức khỏe
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[2].id,
        title: "Khám sức khỏe định kỳ",
        description:
          "Đặt lịch và đi khám sức khỏe tại bệnh viện Đại học Y Hà Nội",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        estimateMinutes: 180,
      },
    }),

    // Cá nhân - Kỹ năng
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[2].id,
        title: "Học tiếng Nhật - Bài 15",
        description:
          "Học từ vựng và ngữ pháp bài 15 trong sách Minna no Nihongo. Luyện tập hội thoại.",
        priority: "LOW",
        status: "INCOMPLETE",
        estimateMinutes: 60,
      },
    }),

    // Cá nhân - Tài chính
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[2].id,
        title: "Lập kế hoạch chi tiêu tháng 9",
        description:
          "Tính toán học phí, tiền ăn, tiền thuê nhà và các chi phí khác. Tiết kiệm cho máy laptop mới.",
        priority: "MEDIUM",
        status: "COMPLETED",
        deadlineAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        estimateMinutes: 45,
      },
    }),

    // Thể thao
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[4].id,
        title: "Tập gym - Chest & Triceps",
        description:
          "Tập luyện nhóm cơ ngực và tay sau. Bench press, dips, tricep extension.",
        priority: "LOW",
        status: "COMPLETED",
        deadlineAt: now,
        completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        estimateMinutes: 90,
      },
    }),

    // Thể thao - Đăng ký
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[4].id,
        title: "Đăng ký giải bóng đá khoa CNTT",
        description:
          "Đăng ký tham gia giải bóng đá tranh cúp khoa Công nghệ thông tin 2024",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        estimateMinutes: 30,
      },
    }),

    // Học tập - Dự án nhóm
    prisma.task.create({
      data: {
        userId: user.id,
        categoryId: categories[0].id,
        title: "Meeting nhóm dự án Software Engineering",
        description:
          "Họp nhóm thảo luận tiến độ dự án quản lý sinh viên. Review code và phân công task mới.",
        priority: "HIGH",
        status: "INCOMPLETE",
        deadlineAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        estimateMinutes: 120,
      },
    }),
  ]);

  console.log("✅ Đã tạo tasks:", tasks.length);

  // Tạo activity logs chi tiết
  await prisma.activityLog.createMany({
    data: [
      {
        userId: user.id,
        action: "task_completed",
        meta: { taskId: tasks[2].id, taskTitle: tasks[2].title },
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        action: "task_completed",
        meta: { taskId: tasks[11].id, taskTitle: tasks[11].title },
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        action: "task_completed",
        meta: { taskId: tasks[12].id, taskTitle: tasks[12].title },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        action: "task_created",
        meta: { taskId: tasks[0].id, taskTitle: tasks[0].title },
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        action: "task_updated",
        meta: {
          taskId: tasks[6].id,
          taskTitle: tasks[6].title,
          changes: ["status"],
        },
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("✅ Đã tạo activity logs");
  console.log("🎉 Hoàn thành tạo dữ liệu mẫu!");
  console.log("");
  console.log("📊 Thống kê dữ liệu đã tạo:");
  console.log(`   👤 Users: 1`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   ✅ Tasks: ${tasks.length}`);
  console.log(`   📝 Activity Logs: 5`);
  console.log("");
  console.log("🔐 Tài khoản test:");
  console.log("   📧 Email: student@gmail.com");
  console.log("   🔑 Password: 123456");
  console.log("");
  console.log("📋 Các loại task được tạo:");
  console.log("   🔴 HIGH Priority: 6 tasks");
  console.log("   🟡 MEDIUM Priority: 6 tasks");
  console.log("   🟢 LOW Priority: 3 tasks");
  console.log("");
  console.log("📈 Trạng thái tasks:");
  console.log("   ⏳ INCOMPLETE: 10 tasks");
  console.log("   🔄 IN_PROGRESS: 3 tasks");
  console.log("   ✅ COMPLETED: 2 tasks");
  console.log("");
  console.log("🏷️ Danh mục tasks:");
  console.log("   📚 Học tập: 7 tasks");
  console.log("   🎭 Ngoại khóa: 2 tasks");
  console.log("   👤 Cá nhân: 3 tasks");
  console.log("   💼 Thực tập: 2 tasks");
  console.log("   🏃‍♂️ Thể thao: 1 tasks");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
