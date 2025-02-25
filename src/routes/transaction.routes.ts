// src/routes/transaction.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import transactionController from '../controllers/transaction.controller';

const router = Router();

// Simplified validation middleware
const transactionValidation = [
  body('title')
      .notEmpty().withMessage('Title is required'),

  body('amount')
      .exists().withMessage('Amount is required')
      .isFloat({ min: 0 }).withMessage('Amount must be a positive number')
      .toFloat(),

  body('debtorAccount')
      .notEmpty().withMessage('Debtor account is required'),

  body('categoryCode')
      .notEmpty().withMessage('Category code is required'),

  body('paymentMethod')
      .notEmpty().withMessage('Payment method is required')
];

// Routes
router.post('/', transactionValidation, transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;