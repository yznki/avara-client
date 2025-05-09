import { createBrowserRouter } from 'react-router-dom';
import { TransactionRangeProvider } from './context/TransactionRangeContext';
import Layout from './layouts/layout';
import Accounts from './pages/Accounts';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import SignUp from './pages/Auth/SignUp';
import VerifyEmail from './pages/Auth/VerifyEmail';
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
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);
