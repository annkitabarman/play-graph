import { useAuth } from "@clerk/react";
import { useEffect, type ReactNode } from "react";
import { setGetToken } from "./apis/steam.api";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { getToken } = useAuth();

  useEffect(() => {
    setGetToken(getToken);
  }, [getToken]);

  return <>{children}</>;
}
