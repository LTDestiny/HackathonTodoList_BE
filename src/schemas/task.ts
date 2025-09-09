import { z } from "zod";

export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional().default("MEDIUM"),
  status: z
    .enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"])
    .optional()
    .default("INCOMPLETE"),
  deadlineAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  estimateMinutes: z.number().min(1).optional(),
});

export const TaskUpdateSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
  deadlineAt: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  estimateMinutes: z.number().min(1).optional(),
});

export const TaskStatusUpdateSchema = z.object({
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]),
});

export const TaskQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  search: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "deadlineAt", "priority", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type TaskCreateInput = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;
export type TaskStatusUpdateInput = z.infer<typeof TaskStatusUpdateSchema>;
export type TaskQueryInput = z.infer<typeof TaskQuerySchema>;
