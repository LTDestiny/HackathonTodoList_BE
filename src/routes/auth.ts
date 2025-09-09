import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", authenticateToken, AuthController.me);

export default router;
