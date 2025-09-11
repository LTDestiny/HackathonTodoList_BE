#!/usr/bin/env node

// Build script for Vercel deployment
// Sets a temporary DATABASE_URL for Prisma generate during build

const { execSync } = require("child_process");

// Set a placeholder DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://neondb_owner:npg_hcKrlnO5Ne1L@ep-dawn-resonance-a15ydks1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

try {
  console.log("🔧 Generating Prisma client...");
  execSync("prisma generate", { stdio: "inherit" });
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
