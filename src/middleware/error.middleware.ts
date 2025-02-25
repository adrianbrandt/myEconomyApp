import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    // Log the full error details for server-side debugging
    logger.error(`Full error details: ${error.toString()}`);

    // Log the stack trace
    if (error.stack) {
      logger.error(`Error stack trace: ${error.stack}`);
    }

    // Log the request body for context
    logger.error(`Request body: ${JSON.stringify(req.body)}`);

    if (error instanceof HttpException) {
      return res.status(error.status).json({
        status: error.status,
        message: error.message,
      });
    }

    // Use type checking for Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      // Need to use any to access the code property
      const prismaError = error as any;

      if (prismaError.code === 'P2002') {
        return res.status(409).json({
          status: 409,
          message: 'Resource already exists',
        });
      }

      if (prismaError.code === 'P2025') {
        return res.status(404).json({
          status: 404,
          message: 'Resource not found',
        });
      }
    }

    // For unhandled errors, return a 500 with some context
    return res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      errorName: error.name,
      errorMessage: error.message
    });
  } catch (err) {
    // Fallback error handler
    logger.error(`Error in error handling middleware: ${err}`);

    return res.status(500).json({
      status: 500,
      message: 'An unexpected error occurred'
    });
  }
};

export { HttpException };