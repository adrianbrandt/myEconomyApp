import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import transactionService from '../services/transaction.service';
import logger from '../utils/logger';

class TransactionController {
  /**
   * Format validation errors with proper typing
   */
  private formatValidationErrors = (errors: ValidationError[]): { field: string; message: string }[] => {
    return errors.map(error => {
      // Type assertion to access properties safely
      const typedError = error as any;
      return {
        field: typedError.path || typedError.param || 'unknown',
        message: typedError.msg || 'Validation error'
      };
    });
  }

  /**
   * Create a new transaction
   */
  createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log the incoming request body for debugging
      logger.info(`Incoming transaction creation request body: ${JSON.stringify(req.body)}`);

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Format errors to provide more context
        const formattedErrors = this.formatValidationErrors(errors.array());

        logger.warn(`Validation errors in transaction creation: ${JSON.stringify(formattedErrors)}`);

        return res.status(400).json({
          status: 400,
          message: 'Validation Error',
          errors: formattedErrors
        });
      }

      // Attempt to create the transaction
      const transaction = await transactionService.create(req.body);

      logger.info(`Transaction created successfully with ID: ${transaction.id}`);

      return res.status(201).json(transaction);
    } catch (error) {
      // Log the full error for server-side debugging
      logger.error(`Error in createTransaction: ${error}`);

      // Pass to error handling middleware
      next(error);
    }
  }

  /**
   * Get all transactions with pagination and filtering
   */
  getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await transactionService.findAll(req.query);

      return res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a transaction by its ID
   */
  getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await transactionService.findById(req.params.id);

      return res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a transaction
   */
  updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await transactionService.update(req.params.id, req.body);
      logger.info(`Transaction updated with ID: ${transaction.id}`);

      return res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a transaction
   */
  deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await transactionService.delete(req.params.id);
      logger.info(`Transaction deleted with ID: ${req.params.id}`);

      return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();