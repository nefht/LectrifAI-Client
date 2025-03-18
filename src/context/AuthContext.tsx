import React, { createContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  account: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedAuthData = JSON.parse(localStorage.getItem("authData") || "null");

  const [authData, setAuthData] = useState(storedAuthData);
  const [token, setToken] = useState<string | null>(authData?.token || null);
  const [user, setUser] = useState<User | null>(authData?.user || null); // Update this line to use authData if it exists

  // Lấy authData từ localStorage
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

  // Lưu authData vào localStorage khi authData thay đổi
  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  const login = (token: string, user: User, rememberMe: boolean) => {
    const newAuthData = { token, user, rememberMe };
    setAuthData(newAuthData);
    setToken(token);
    setUser(user);
    localStorage.setItem("authData", JSON.stringify(newAuthData));
  };

  const logout = () => {
    // Xóa authData khi logout
    localStorage.removeItem("authData");
    setToken(null);
    setUser(null);
    setAuthData(null);
  };

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
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
