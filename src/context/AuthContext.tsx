import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persistent session
    const savedSession = localStorage.getItem("mira_session");
    if (savedSession) {
      setIsAuthenticated(true);
      setUser(savedSession);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check credentials provided by the user
    // Username: MIRA, Password: @InfoMira20
    if (username.toUpperCase() === "MIRA" && password === "@InfoMira20") {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem("mira_session", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("mira_session");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
