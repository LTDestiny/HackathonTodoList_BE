"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUpdateSchema = exports.CategoryCreateSchema = void 0;
const zod_1 = require("zod");
exports.CategoryCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Tên danh mục không được để trống"),
    color: zod_1.z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ")
        .optional()
        .default("#3B82F6"),
});
exports.CategoryUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Tên danh mục không được để trống").optional(),
    color: zod_1.z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ")
        .optional(),
});
