import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

const restClient = axios.create({
  baseURL: "http://127.0.0.1:3000/", // URL base da API
});


const getTokenFromSession = (): string | null => {
  const session = localStorage.getItem("session");
  if (!session) return null;

  try {
    const parsedSession = JSON.parse(session);
    return parsedSession?.token || null;
  } catch (error) {
    console.error("Erro ao parsear a sessão do localStorage:", error);
    return null;
  }
};

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
  }
);

export { queryClient, restClient };