import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client with appropriate logging for environment
const logLevels =
  process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: logLevels as any,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Graceful shutdown for serverless
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
