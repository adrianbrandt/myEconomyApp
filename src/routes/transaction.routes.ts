import { Router } from 'express';
import { body } from 'express-validator';
import transactionController from '../controllers/transaction.controller';

const router = Router();

// Validation middleware
const transactionValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Update validation middleware (all fields optional)
const updateTransactionValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
];

// Routes
router.post('/', transactionValidation, transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', updateTransactionValidation, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
