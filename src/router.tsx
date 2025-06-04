import { createBrowserRouter } from 'react-router-dom';
import AdminGuard from './components/AdminGuard';
import ErrorState from './components/Authentication/ErrorState';
import FullPageSpinner from './components/Authentication/FullPageSpinner';
import AuthGuard from './components/AuthGaurd';
import { TransactionRangeProvider } from './context/TransactionRangeContext';
import Layout from './layouts/layout';
import Users from './pages/Admin/Users';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import Unauthorized from './pages/Unauthorized';
import Accounts from './pages/User/Accounts';
import Transactions from './pages/User/Transactions';

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
    path: '/unauthorized',
    element: <Unauthorized />,
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
      {
        path: 'users',
        element: (
          <AdminGuard>
            <Users />
          </AdminGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
