"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
class AuthService {
    static async register(data) {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("The email is already in use.");
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 18);
        const user = await db_1.prisma.user.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
            },
        });
        // Default categories
        await db_1.prisma.category.createMany({
            data: [
                { userId: user.id, name: "Học tập", color: "#3B82F6" },
                { userId: user.id, name: "Ngoại khóa", color: "#10B981" },
                { userId: user.id, name: "Cá nhân", color: "#F59E0B" },
            ],
        });
        const token = this.generateToken(user.id);
        return { user, token };
    }
    static async login(data) {
        const user = await db_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
        }
        const token = this.generateToken(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    static generateToken(userId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        return jsonwebtoken_1.default.sign({ userId }, secret);
    }
}
exports.AuthService = AuthService;
