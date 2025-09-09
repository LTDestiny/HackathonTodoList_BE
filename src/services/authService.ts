import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginInput, RegisterInput } from "../schemas/auth";
import { prisma } from "../utils/db";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("The email is already in use.");
    }

    const passwordHash = await bcrypt.hash(data.password, 18);

    const user = await prisma.user.create({
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
    await prisma.category.createMany({
      data: [
        { userId: user.id, name: "Học tập", color: "#3B82F6" },
        { userId: user.id, name: "Ngoại khóa", color: "#10B981" },
        { userId: user.id, name: "Cá nhân", color: "#F59E0B" },
      ],
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email or password.");
    }
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
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

  private static generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userId }, secret);
  }
}
