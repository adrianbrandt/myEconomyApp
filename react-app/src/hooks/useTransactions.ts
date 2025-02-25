// src/hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Transaction Interfaces
export interface Transaction {
    id: string;
    title: string;
    amount: number;
    currencyCode: string;
    debtorAccount: string;
    creditorAccount?: string;
    categoryCode: string;
    bookingDate: string;
    valueDate: string;
    remittanceInformation?: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionResponse {
    data: Transaction[];
    count: number;
    page: number;
    limit: number;
}

export interface DashboardStats {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    recentTransactions: Transaction[];
}

// Custom Hooks
export const useTransactions = (page = 1, limit = 10) => {
    return useQuery<TransactionResponse>({
        queryKey: ['transactions', page, limit],
        queryFn: async () => {
            const { data } = await axios.get(`/api/transactions?page=${page}&limit=${limit}`);
            return data;
        },
    });
};

export const useTransaction = (id: string) => {
    return useQuery<Transaction>({
        queryKey: ['transaction', id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/transactions/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await axios.get('/api/dashboard/stats');
            return data;
        },
    });
};

// Transaction Mutation Hook
export const useAddTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation<Transaction, Error, Partial<Transaction>>({
        mutationFn: async (newTransaction) => {
            const { data } = await axios.post('/api/transactions', newTransaction);
            return data;
        },
        // Invalidate and refetch queries after mutation
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
        onError: (error) => {
            console.error('Transaction creation error:', error);
        }
    });
};