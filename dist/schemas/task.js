"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQuerySchema = exports.TaskStatusUpdateSchema = exports.TaskUpdateSchema = exports.TaskCreateSchema = void 0;
const zod_1 = require("zod");
exports.TaskCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Tiêu đề không được để trống"),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    priority: zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]).optional().default("MEDIUM"),
    status: zod_1.z
        .enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"])
        .optional()
        .default("INCOMPLETE"),
    deadlineAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    estimateMinutes: zod_1.z.number().min(1).optional(),
});
exports.TaskUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Tiêu đề không được để trống").optional(),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    priority: zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    status: zod_1.z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
    deadlineAt: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined)),
    estimateMinutes: zod_1.z.number().min(1).optional(),
});
exports.TaskStatusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]),
});
exports.TaskQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().default("1").transform(Number),
    limit: zod_1.z.string().optional().default("10").transform(Number),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    priority: zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    status: zod_1.z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
    sortBy: zod_1.z
        .enum(["createdAt", "updatedAt", "deadlineAt", "priority", "title"])
        .optional()
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("desc"),
});
