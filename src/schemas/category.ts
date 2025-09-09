import { z } from "zod";

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ")
    .optional()
    .default("#3B82F6"),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ")
    .optional(),
});

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
