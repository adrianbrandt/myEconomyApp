import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TransactionList from './pages/TransactionList';
import AddTransaction from './pages/AddTransaction';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/transactions">Transactions</Link>
                        </li>
                        <li>
                            <Link to="/add-transaction">Add Transaction</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<TransactionList />} />
                    <Route path="/add-transaction" element={<AddTransaction />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;