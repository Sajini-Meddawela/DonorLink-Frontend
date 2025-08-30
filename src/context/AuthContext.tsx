import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { connectSocket, disconnectSocket } from "../services/socket";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "DONOR" | "CAREHOME";
  isVerified: boolean;
  unreadNotifications?: number; // Add this property
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void; // Add this function
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        try {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;

          const response = await axios.get(
            "http://localhost:4000/api/v1/auth/me"
          );

          const userData =
            response.data.user || (storedUser ? JSON.parse(storedUser) : null);
          setUser(userData);
          setToken(storedToken);

          // Connect socket after successful authentication
          connectSocket(storedToken);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setToken(null);
          delete axios.defaults.headers.common["Authorization"];

          disconnectSocket();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setToken(token);

      connectSocket(token);

      if (user.role === "CAREHOME") {
        navigate("/care_dashboard");
      } else {
        navigate("/donor_dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      disconnectSocket();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    disconnectSocket();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setUser(null);
    setToken(null);

    // Remove axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Navigate to login
    navigate("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser, 
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};