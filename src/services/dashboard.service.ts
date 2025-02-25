// src/services/dashboard.service.ts
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

class DashboardService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getDashboardStats() {
        try {
            // Get total income (sum of positive transactions)
            const totalIncome = await this.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    amount: {
                        gt: 0
                    }
                }
            });

            // Get total expenses (sum of negative transactions)
            const totalExpenses = await this.prisma.transaction.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    amount: {
                        lt: 0
                    }
                }
            });

            // Get recent transactions (last 5)
            const recentTransactions = await this.prisma.transaction.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // Calculate balance
            const income = totalIncome._sum.amount || 0;
            const expenses = Math.abs(totalExpenses._sum.amount || 0);
            const balance = income - expenses;

            return {
                totalIncome: income,
                totalExpenses: expenses,
                balance,
                recentTransactions
            };
        } catch (error) {
            logger.error(`Error fetching dashboard stats: ${error}`);
            throw error;
        }
    }
}

export default new DashboardService();