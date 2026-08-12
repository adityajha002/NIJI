import {
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUserRole: (role: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateUserRole = (role: string) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = {
        ...currentUser,
        role,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      try {
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
          setToken(storedToken);
        } else {
          const decoded = JSON.parse(
            atob(storedToken.split(".")[1])
          ) as User;

          if (!decoded.name) {
            localStorage.removeItem("token");
          } else {
            setUser(decoded);
            setToken(storedToken);
          }
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserRole,
        token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};