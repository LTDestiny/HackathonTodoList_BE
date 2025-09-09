import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.createCategory);
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
