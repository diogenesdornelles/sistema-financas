import { PropsWithChildren, useState } from "react";
import { AuthContext } from "./auth-context";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { TokenProps} from '../../../packages/dtos/token.dto'

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<TokenProps | null>(null);
  const { mutateAsync: login, isPending } = useLoginMutation();

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
