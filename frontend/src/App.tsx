import {
  QueryClientProvider
} from '@tanstack/react-query'

import './App.css'
import { SessionProvider } from './context/session-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/root-layout';
import Home from './pages/home';
import Login from './pages/login';
import { RequireAuth } from './components/require-auth';
import { queryClient } from './utils/client';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
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
        path: "/cadastrar",
        element: (
          <RequireAuth>
            <Home /> 
          </RequireAuth>
        ),
      },
      {
        path: "/consultas",
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Home />
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
        <RouterProvider router={router} />
      </SessionProvider>
    </QueryClientProvider>

  )
}
