import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    recentTransactions: Array<{
        id: number;
        amount: number;
        description: string;
        date: string;
        type: 'INCOME' | 'EXPENSE';
    }>;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard');
                setStats(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch dashboard statistics');
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!stats) return <div>No data available</div>;

    return (
        <div className="dashboard">
            <h2>Financial Dashboard</h2>
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Income</h3>
                    <p>${stats.totalIncome.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p>${stats.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="summary-card">
                    <h3>Current Balance</h3>
                    <p>${stats.balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;