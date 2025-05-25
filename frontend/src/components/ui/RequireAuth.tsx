import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

// Componente para proteger as rotas privadas
interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login'); // Redireciona para login se não estiver autenticado
    }
  }, [session, navigate]);

  // Retorna null enquanto o redirecionamento não foi feito
  if (!session) {
    return null;
  }

  // Renderiza os filhos se estiver autenticado
  return <>{children}</>;
}
