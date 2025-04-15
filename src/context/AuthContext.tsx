import React, { createContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  fullName: string;
  email: string;
  account: string;
  role?: string;
}

interface AuthData {
  token: string;
  user: User;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedAuthData = JSON.parse(localStorage.getItem("authData") || "null");
  const [authData, setAuthData] = useState<AuthData | null>(storedAuthData);
  const [token, setToken] = useState<string | null>(
    storedAuthData?.token || null
  );
  const [user, setUser] = useState<User | null>(storedAuthData?.user || null);

  // Kiểm tra token hết hạn và tự logout
  useEffect(() => {
    if (authData && authData.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (authData.exp < now) {
        console.warn("Token expired, logging out...");
        logout();
      }
    }
  }, [authData]);

  // Lấy authData từ localStorage khi tải trang
  useEffect(() => {
    const storedAuthData = JSON.parse(
      localStorage.getItem("authData") || "null"
    );
    if (storedAuthData) {
      setAuthData(storedAuthData);
      setToken(storedAuthData.token);
      setUser(storedAuthData.user);
    }
  }, []);

  // Lưu authData vào localStorage khi thay đổi
  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  const login = (token: string, user: User) => {
    try {
      const decoded: any = jwtDecode(token);
      const newAuthData: AuthData = { token, user, exp: decoded.exp };
      setAuthData(newAuthData);
      setToken(token);
      setUser(user);
      localStorage.setItem("authData", JSON.stringify(newAuthData));
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("authData");
    setToken(null);
    setUser(null);
    setAuthData(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
