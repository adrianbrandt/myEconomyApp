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
    logger.error(`Error: ${error.message}`);

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

    return res.status(500).json({
      status: 500,
      message: 'Something went wrong',
    });
  } catch (err) {
    next(err);
  }
};

export { HttpException };