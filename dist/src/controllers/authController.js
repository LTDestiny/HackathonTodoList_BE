"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const auth_1 = require("../schemas/auth");
class AuthController {
    static async register(req, res) {
        try {
            const validateData = auth_1.RegisterSchema.parse(req.body);
            const result = await authService_1.AuthService.register(validateData);
            res
                .status(201)
                .json({ message: "User registered successfully", ...result });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    static async login(req, res) {
        try {
            const validatedData = auth_1.LoginSchema.parse(req.body);
            const result = await authService_1.AuthService.login(validatedData);
            res.json({
                message: "Đăng nhập thành công",
                ...result,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async logout(req, res) {
        res.json({ message: "Đăng xuất thành công" });
    }
    static async me(req, res) {
        res.json({ user: req.user });
    }
}
exports.AuthController = AuthController;
