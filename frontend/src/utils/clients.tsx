import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getTokenFromSession } from '@/utils/getTokenFromSession';
import { handleUnauthorizedAccess } from '@/utils/handleUnauthorizedAccess';

const queryClient = new QueryClient();

const restClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const token = getTokenFromSession();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para adicionar o token no cabeçalho
restClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

restClient.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente se não houver erro
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (data.statusCode === 401 && data.error === 'Unauthorized') {
        handleUnauthorizedAccess();
      }

      console.error(`Erro ${status}:`, data.message || 'Erro desconhecido');
      return Promise.reject(data);
    }
  },
);

export { queryClient, restClient };
