"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters long"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
