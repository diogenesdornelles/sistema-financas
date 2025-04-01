import { createContext } from "react";

// cria um contexto que define quais valores e funções estarão disponíveis globalmente no seu app
export const AuthContext = createContext<{
    signIn: (cpf: string, pwd: string) => Promise<boolean>; // São funções (callbacks) que serão chamadas para fazer login ou logout
    signOut: () => void;
    session?: string | null; // Valor que identifica a sessão atual do usuário. Pode ser um token ou qualquer string que represente que o usuário está autenticado. Se null, não está autenticado
    isLoading: boolean; // O estado (nesse caso, a sessão) ainda está sendo carregado
}>({
    signIn: async () => false,
    signOut: async () => null,
    session: null,
    isLoading: false,
});