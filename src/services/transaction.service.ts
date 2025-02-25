import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TransactionDTO, TransactionQueryParams } from '../types/transaction.types';
import { HttpException } from '../middleware/error.middleware';
import logger from '../utils/logger';

class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: TransactionDTO) {
    try {
      logger.info(`Attempting to create transaction: ${JSON.stringify(data)}`);

      // Create a transaction object with all required fields from the schema
      const transactionData = {
        id: uuidv4(), // Generate a UUIDv4 for the transaction
        title: data.title,
        amount: data.amount,
        currencyCode: data.currencyCode || "EUR", // Default value from schema
        debtorAccount: data.debtorAccount,
        creditorAccount: data.creditorAccount,
        categoryCode: data.categoryCode,
        bookingDate: data.bookingDate || new Date(), // Default to now if not provided
        valueDate: data.valueDate || new Date(), // Default to now if not provided
        remittanceInformation: data.remittanceInformation,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus || "BOOKED" // Default value from schema
      };

      logger.info(`Prepared transaction data: ${JSON.stringify(transactionData)}`);

      const result = await this.prisma.transaction.create({
        data: transactionData,
      });

      logger.info(`Transaction created successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error(`Error creating transaction: ${error}`);
      if (error instanceof Error) {
        logger.error(`Stack trace: ${error.stack}`);
      }
      throw error;
    }
  }

  async findAll(query: TransactionQueryParams) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      let where: any = {};

      // Basic filters
      if (query.categoryCode) {
        where.categoryCode = query.categoryCode;
      }

      if (query.debtorAccount) {
        where.debtorAccount = query.debtorAccount;
      }

      if (query.paymentMethod) {
        where.paymentMethod = query.paymentMethod;
      }

      if (query.paymentStatus) {
        where.paymentStatus = query.paymentStatus;
      }

      // Handle date range queries
      if (query.bookingDateFrom || query.bookingDateTo) {
        where.bookingDate = {};

        if (query.bookingDateFrom) {
          where.bookingDate.gte = new Date(query.bookingDateFrom);
        }

        if (query.bookingDateTo) {
          where.bookingDate.lte = new Date(query.bookingDateTo);
        }
      }

      // Fuzzy search implementation
      if (query.search && query.search.trim() !== '') {
        const searchTerm = query.search.trim();

        // Add fuzzy search conditions
        where.OR = [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { debtorAccount: { contains: searchTerm, mode: 'insensitive' } },
          { creditorAccount: { contains: searchTerm, mode: 'insensitive' } },
          { categoryCode: { contains: searchTerm, mode: 'insensitive' } },
          { remittanceInformation: { contains: searchTerm, mode: 'insensitive' } },
          { paymentMethod: { contains: searchTerm, mode: 'insensitive' } }
        ];
      }

      const [transactions, count] = await Promise.all([
        this.prisma.transaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.transaction.count({ where }),
      ]);

      return {
        data: transactions,
        count,
        page,
        limit,
      };
    } catch (error) {
      logger.error(`Error finding transactions: ${error}`);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new HttpException(404, `Transaction with ID ${id} not found`);
      }

      return transaction;
    } catch (error) {
      logger.error(`Error finding transaction by ID: ${error}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<TransactionDTO>) {
    try {
      // Check if transaction exists
      await this.findById(id);

      return await this.prisma.transaction.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error(`Error updating transaction: ${error}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      // Check if transaction exists
      await this.findById(id);

      return await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error deleting transaction: ${error}`);
      throw error;
    }
  }
}

export default new TransactionService();