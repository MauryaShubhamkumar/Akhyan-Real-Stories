import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { login as apiLogin, signup as apiSignup, logout as apiLogout, me as apiMe } from "../features/auth/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const data = await apiMe();

        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void getCurrentUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const data = await apiLogin({
      email,
      password,
    });

    setUser(data.user);
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    const data = await apiSignup({
      username,
      email,
      password,
    });

    setUser(data.user);
  };

  const logout = async (): Promise<void> => {
    await apiLogout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}