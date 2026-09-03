import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  type AuthUser,
  type RegisterResponse,
  type UserRole,
} from "../api/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: {
    email: string;
    password: string;
    role: UserRole;
    candidateId?: string;
    recruiterId?: number;
  }) => Promise<RegisterResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "smart_recruitment_token";
const USER_KEY = "smart_recruitment_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const result = await loginApi(email, password);

      localStorage.setItem(TOKEN_KEY, result.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));

      setToken(result.accessToken);
      setUser(result.user);

      return result.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    role: UserRole;
    candidateId?: string;
    recruiterId?: number;
  }) => {
    return registerApi(data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}