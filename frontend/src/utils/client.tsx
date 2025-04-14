import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getTokenFromSession } from "./get-token-from-session";
import { handleUnauthorizedAccess } from "./handle-unauthorized-access";


const queryClient = new QueryClient();

const restClient = axios.create({
  baseURL: "http://127.0.0.1:3000/", // URL base da API

});

const token = getTokenFromSession();
if (token) {
  axios.defaults.headers.common['Authorization']  = `Bearer ${token}`;
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
  }
);


restClient.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente se não houver erro
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (data.statusCode === 401 && data.error === "Unauthorized") {
        handleUnauthorizedAccess()
      }

      console.error(`Erro ${status}:`, data.message || "Erro desconhecido");
      return Promise.reject(data);
    }
  }
);

export { queryClient, restClient };