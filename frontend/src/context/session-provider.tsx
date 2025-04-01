import { PropsWithChildren, useState } from "react";
import { AuthContext } from "./auth-context";
import { useLoginMutation } from "../hooks/useLoginMutation";

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const { mutateAsync: login, isPending } = useLoginMutation();

  return (
    <AuthContext.Provider
      value={{
        signIn: async (cpf, pwd) => {
          try {
            const result = await login({ cpf, pwd });
            if (result) {
              setSession(result.user.name);
              localStorage.setItem("session", JSON.stringify(result));
              return true;
            }
          } catch (err) {
            console.error("Login failed", err);
          }
          return false;
        },
        signOut: () => {
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
