import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TransactionDTO, TransactionQueryParams } from '../types/transaction.types';
import { HttpException } from '../middleware/error.middleware';

class TransactionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: TransactionDTO) {
    try {
      return await this.prisma.transaction.create({
        data: {
          ...data,
          id: uuidv4() // Generate a UUIDv4 for the transaction
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: TransactionQueryParams) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;

      const where = query.category ? { category: query.category } : {};

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
      throw error;
    }
  }
}

export default new TransactionService();