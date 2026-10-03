import { useAuth } from "@clerk/react";
import { type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
