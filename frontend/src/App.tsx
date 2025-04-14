import {
  QueryClientProvider
} from '@tanstack/react-query'

import './App.css'
import { SessionProvider } from './providers/session-provider'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import Home from './pages/home';
import Login from './pages/login';
import { RequireAuth } from './components/require-auth';
import { queryClient } from './utils/client';;
import { ColorModeProvider } from './providers/color-mode-provider';
import Manage from './pages/manage'
import Manual from './pages/manual';
import Dashboard from './pages/dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "/login", element: <Login /> },
      {
        path: "/home",
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: "/gerenciar",
        element: (
          <RequireAuth>
            <Manage />
          </RequireAuth>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/manual",
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

  )
}
