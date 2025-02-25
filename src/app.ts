import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import transactionRoutes from './routes/transaction.routes';
import { errorMiddleware } from './middleware/error.middleware';
import logger from './utils/logger';
import dashboardRoutes from "./routes/dashboard.routes";

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Express app
const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // This is the default Vite frontend port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/transactions', transactionRoutes);
app.use('/dashboard',dashboardRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Connected to database');

    // Start server
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Start the server
startServer();

export default app;
