import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

export function useEndSession() {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  return () => {
    alert('Sessão encerrada. Por favor, faça login novamente!');
    logOut();
    navigate('/login');
  };
}
