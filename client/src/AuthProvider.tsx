import { useAuth } from "@clerk/react";
import { useEffect, type ReactNode } from "react";

import { setGetToken } from "./apis/steam.api";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setGetToken(getToken);
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
