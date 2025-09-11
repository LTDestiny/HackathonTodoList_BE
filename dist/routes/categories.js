"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get("/", categoryController_1.CategoryController.getCategories);
router.post("/", categoryController_1.CategoryController.createCategory);
router.get("/:id", categoryController_1.CategoryController.getCategoryById);
router.put("/:id", categoryController_1.CategoryController.updateCategory);
router.delete("/:id", categoryController_1.CategoryController.deleteCategory);
exports.default = router;
