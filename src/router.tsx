import { createBrowserRouter } from 'react-router-dom';
import ErrorState from './components/Authentication/ErrorState';
import FullPageSpinner from './components/Authentication/FullPageSpinner';
import AuthGuard from './components/AuthGaurd';
import { TransactionRangeProvider } from './context/TransactionRangeContext';
import Layout from './layouts/layout';
import Accounts from './pages/Accounts';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

export const router = createBrowserRouter([
  {
    path: '/loading',
    element: <FullPageSpinner />,
  },
  {
    path: '/error',
    element: <ErrorState message="Something went wrong loading your data." />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
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
  {
    path: '*',
    element: <div>404</div>,
  },
]);
