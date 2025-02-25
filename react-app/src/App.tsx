import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TransactionList from './pages/TransactionList';
import AddTransaction from './pages/AddTransaction';
import Dashboard from './pages/Dashboard';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Stale time of 5 minutes
            staleTime: 1000 * 60 * 5,
            // Keep unused data in cache for 15 minutes
            gcTime: 1000 * 60 * 15,
            // Retry failed requests once
            retry: 1,
            // Don't refetch when window is refocused
            refetchOnWindowFocus: false,
        },
    },
});

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="app-container">
                    <nav>
                        <ul>
                            <li><Link to="/">Dashboard</Link></li>
                            <li><Link to="/transactions">Transactions</Link></li>
                            <li><Link to="/add-transaction">Add Transaction</Link></li>
                        </ul>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/transactions" element={<TransactionList />} />
                        <Route path="/add-transaction" element={<AddTransaction />} />
                    </Routes>
                </div>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;