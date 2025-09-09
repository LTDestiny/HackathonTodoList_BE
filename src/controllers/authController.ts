import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { RegisterSchema, LoginSchema } from "../schemas/auth";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validateData = RegisterSchema.parse(req.body);
      const result = await AuthService.register(validateData);

      res
        .status(201)
        .json({ message: "User registered successfully", ...result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);

      res.json({
        message: "Đăng nhập thành công",
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.json({ message: "Đăng xuất thành công" });
  }

  static async me(req: Request, res: Response) {
    res.json({ user: (req as any).user });
  }
}
