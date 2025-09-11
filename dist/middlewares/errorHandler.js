"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    if (err.code === "P2002") {
        return res.status(400).json({
            error: "Dữ liệu đã tồn tại",
            details: err.meta?.target || "Unique constraint failed",
        });
    }
    if (err.code === "P2025") {
        return res.status(404).json({
            error: "Không tìm thấy dữ liệu",
        });
    }
    if (err.name === "ZodError") {
        return res.status(400).json({
            error: "Dữ liệu đầu vào không hợp lệ",
            details: err.errors,
        });
    }
    res.status(500).json({
        error: "Lỗi server nội bộ",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
};
exports.errorHandler = errorHandler;
