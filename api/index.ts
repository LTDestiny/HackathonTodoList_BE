import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "../src/routes/auth";
import taskRoutes from "../src/routes/tasks";
import categoryRoutes from "../src/routes/categories";
import statsRoutes from "../src/routes/stats";
import { errorHandler } from "../src/middlewares/errorHandler";

// Load environment variables
dotenv.config();

const app = express();

// Rate limiting - adjusted for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Adjusted for Vercel
  })
);
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "https://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Export the Express app as a serverless function
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error?.message || "Unknown error"
          : "Something went wrong",
    });
  }
}
