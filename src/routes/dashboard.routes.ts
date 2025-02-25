// src/routes/dashboard.routes.ts
import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';

const router = Router();

// Dashboard stats route
router.get('/stats', dashboardController.getDashboardStats);

export default router;