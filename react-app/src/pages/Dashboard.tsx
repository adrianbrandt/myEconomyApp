// src/pages/Dashboard.tsx
import React from 'react';
import { useDashboardStats } from '../hooks/useTransactions';

const Dashboard: React.FC = () => {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) return <div className="loading">Loading Dashboard...</div>;
    if (error) return <div className="error-message">Failed to load dashboard</div>;
    if (!stats) return <div>No dashboard data available</div>;

    return (
        <div className="dashboard">
            <h2>Financial Dashboard</h2>

            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Income</h3>
                    <p>€{stats.totalIncome.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p>€{stats.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Current Balance</h3>
                    <p>€{stats.balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{new Date(transaction.bookingDate).toLocaleDateString()}</td>
                            <td>{transaction.title}</td>
                            <td>€{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.categoryCode}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;