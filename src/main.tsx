import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { Toaster } from 'sonner';
import { CurrencyProvider } from './context/CurrencyContext';
import { UserProvider } from './context/UserContext';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

if (!domain || !clientId) {
  throw new Error(
    'Missing Auth0 configuration: VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID is not defined.',
  );
}

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = stored === 'dark' || (!stored && prefersDark);

  document.documentElement.classList.toggle('dark', shouldUseDark);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <UserProvider>
        <CurrencyProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CurrencyProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>,
);
