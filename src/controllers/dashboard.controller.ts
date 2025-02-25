// src/controllers/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';
import logger from '../utils/logger';

class DashboardController {
    /**
     * Get dashboard statistics
     */
    getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await dashboardService.getDashboardStats();

            logger.info('Dashboard stats retrieved successfully');

            return res.status(200).json(stats);
        } catch (error) {
            logger.error(`Error in getDashboardStats: ${error}`);
            next(error);
        }
    }
}

export default new DashboardController();