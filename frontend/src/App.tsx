import { QueryClientProvider } from '@tanstack/react-query';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './App.css';

import { RequireAuth } from '@/components/ui/RequireAuth';
import RootLayout from '@/layouts/RootLayout';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Manage from '@/pages/Manage';
import Manual from '@/pages/Manual';
import { ColorModeProvider } from '@/providers/ColorModeProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { queryClient } from '@/utils/clients';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: '/login', element: <Login /> },
      {
        path: '/home',
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: '/gerenciar',
        element: (
          <RequireAuth>
            <Manage />
          </RequireAuth>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: '/manual',
        element: (
          <RequireAuth>
            <Manual />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ColorModeProvider>
          <RouterProvider router={router} />
        </ColorModeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
