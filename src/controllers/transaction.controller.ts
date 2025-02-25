import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import transactionService from '../services/transaction.service';
import { HttpException } from '../middleware/error.middleware';
import { TransactionQueryParams } from '../types/transaction.types';

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validation error');
      }

      const transaction = await transactionService.create(req.body);
      return res.status(201).json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // In the getAllTransactions method of your transaction.controller.ts
  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const query: TransactionQueryParams = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        categoryCode: req.query.categoryCode as string | undefined,
        debtorAccount: req.query.debtorAccount as string | undefined,
        bookingDateFrom: req.query.bookingDateFrom as string | undefined,
        bookingDateTo: req.query.bookingDateTo as string | undefined,
        paymentMethod: req.query.paymentMethod as string | undefined,
        paymentStatus: req.query.paymentStatus as string | undefined,
        search: req.query.search as string | undefined, // Add this line
      };

      const transactions = await transactionService.findAll(query);
      return res.status(200).json({
        status: 'success',
        ...transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.findById(id);
      return res.status(200).json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new HttpException(400, 'Validation error');
      }

      const { id } = req.params;
      const transaction = await transactionService.update(id, req.body);
      return res.status(200).json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await transactionService.delete(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
