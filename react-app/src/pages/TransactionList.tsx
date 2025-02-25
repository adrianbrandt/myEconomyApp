// src/pages/TransactionList.tsx
import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

const TransactionList: React.FC = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useTransactions(page);

    if (isLoading) return <div className="loading">Loading Transactions...</div>;
    if (error) return <div className="error-message">Failed to load transactions</div>;
    if (!data || data.data.length === 0) return <div>No transactions found</div>;

    return (
        <div className="transaction-list">
            <h2>Transactions</h2>

            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                </tr>
                </thead>
                <tbody>
                {data.data.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{new Date(transaction.bookingDate).toLocaleDateString()}</td>
                        <td>{transaction.title}</td>
                        <td>€{transaction.amount.toFixed(2)}</td>
                        <td>{transaction.categoryCode}</td>
                        <td>{transaction.paymentMethod}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {Math.ceil(data.count / data.limit)}</span>
                <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= Math.ceil(data.count / data.limit)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionList;