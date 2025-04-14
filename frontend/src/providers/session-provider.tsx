import { PropsWithChildren, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useLogin } from "../hooks/use-login";
import { TokenProps} from '../../../packages/dtos/token.dto'

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<TokenProps | null>(null);
  const { mutateAsync: login, isPending } = useLogin();
  // Carregar a sessão do localStorage quando o componente for montado
  useEffect(() => {
    const sessionDb = localStorage.getItem("session");
    if (sessionDb) {
      setSession(JSON.parse(sessionDb));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logIn: async (cpf, pwd) => {
          try {
            const result = await login({ cpf, pwd });
            if (result) {
              setSession(result);
              localStorage.setItem("session", JSON.stringify(result));
              return true;
            }
          } catch (err) {
            console.error("Login failed", err);
          }
          return false;
        },
        logOut: () => {
          setSession(null);
          localStorage.removeItem("session");
        },
        session,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
