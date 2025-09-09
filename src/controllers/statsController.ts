import { Response } from "express";
import { StatsService } from "../services/statsService";
import { AuthRequest } from "../middlewares/auth";

export class StatsController {
  static async getUserStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await StatsService.getUserStats(userId);

      res.json({ stats });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
