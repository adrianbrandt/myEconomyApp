// src/pages/AddTransaction.tsx
import React, { useState } from 'react';
import { useAddTransaction } from '../hooks/useTransactions';

const AddTransaction: React.FC = () => {
    const addTransactionMutation = useAddTransaction();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [debtorAccount, setDebtorAccount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newTransaction = {
            title,
            amount: parseFloat(amount),
            categoryCode,
            paymentMethod,
            debtorAccount,
            currencyCode: 'EUR',
            paymentStatus: 'BOOKED'
        };

        addTransactionMutation.mutate(newTransaction, {
            onSuccess: () => {
                // Reset form
                setTitle('');
                setAmount('');
                setCategoryCode('');
                setPaymentMethod('CARD');
                setDebtorAccount('');
            }
        });
    };

    return (
        <div className="add-transaction">
            <h2>Add New Transaction</h2>

            {addTransactionMutation.isError && (
                <div className="error-message">
                    Failed to add transaction: {addTransactionMutation.error.message}
                </div>
            )}

            {addTransactionMutation.isSuccess && (
                <div className="success-message">
                    Transaction added successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="categoryCode">Category:</label>
                    <select
                        id="categoryCode"
                        value={categoryCode}
                        onChange={(e) => setCategoryCode(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="GROCERIES">Groceries</option>
                        <option value="TRANSPORTATION">Transportation</option>
                        <option value="UTILITIES">Utilities</option>
                        <option value="ENTERTAINMENT">Entertainment</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="paymentMethod">Payment Method:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    >
                        <option value="CARD">Card</option>
                        <option value="CASH">Cash</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="debtorAccount">Account:</label>
                    <input
                        type="text"
                        id="debtorAccount"
                        value={debtorAccount}
                        onChange={(e) => setDebtorAccount(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={addTransactionMutation.isPending}
                >
                    {addTransactionMutation.isPending ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;