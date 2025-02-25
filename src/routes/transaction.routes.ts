// src/routes/transaction.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import transactionController from '../controllers/transaction.controller';

const router = Router();

// Validation middleware
const transactionValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currencyCode').optional().isLength({ min: 3, max: 3 }).withMessage('Currency code must be 3 characters'),
  body('debtorAccount').notEmpty().withMessage('Debtor account is required'),
  body('creditorAccount').optional(),
  body('categoryCode').notEmpty().withMessage('Category code is required'),
  body('bookingDate').optional().isISO8601().withMessage('Booking date must be a valid date'),
  body('valueDate').optional().isISO8601().withMessage('Value date must be a valid date'),
  body('remittanceInformation').optional(),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('paymentStatus').optional().isIn(['PENDING', 'BOOKED', 'REJECTED']).withMessage('Invalid payment status')
];

// Update validation middleware (all fields optional)
const updateTransactionValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('currencyCode').optional().isLength({ min: 3, max: 3 }).withMessage('Currency code must be 3 characters'),
  body('debtorAccount').optional().notEmpty().withMessage('Debtor account cannot be empty'),
  body('creditorAccount').optional(),
  body('categoryCode').optional().notEmpty().withMessage('Category code cannot be empty'),
  body('bookingDate').optional().isISO8601().withMessage('Booking date must be a valid date'),
  body('valueDate').optional().isISO8601().withMessage('Value date must be a valid date'),
  body('remittanceInformation').optional(),
  body('paymentMethod').optional().notEmpty().withMessage('Payment method cannot be empty'),
  body('paymentStatus').optional().isIn(['PENDING', 'BOOKED', 'REJECTED']).withMessage('Invalid payment status')
];

// Routes
router.post('/', transactionValidation, transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', updateTransactionValidation, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;