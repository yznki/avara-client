import { createBrowserRouter } from 'react-router-dom';
import { TransactionRangeProvider } from './context/TransactionRangeContext';
import Layout from './layouts/layout';
import Accounts from './pages/Accounts';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <TransactionRangeProvider>
            <Dashboard />
          </TransactionRangeProvider>
        ),
      },
      { path: 'accounts', element: <Accounts /> },
      { path: 'transactions', element: <Transactions /> },
    ],
  },
]);
