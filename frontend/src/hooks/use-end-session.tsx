import { useAuth } from "./use-auth";
import { useNavigate } from "react-router-dom";

export function useEndSession() {
    const { logOut } = useAuth();
    const navigate = useNavigate()
    return () => {
        logOut()
        navigate('/login')
    };
  }

