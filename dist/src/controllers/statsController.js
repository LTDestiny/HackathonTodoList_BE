"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const statsService_1 = require("../services/statsService");
class StatsController {
    static async getUserStats(req, res) {
        try {
            const userId = req.user.id;
            const stats = await statsService_1.StatsService.getUserStats(userId);
            res.json({ stats });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.StatsController = StatsController;
