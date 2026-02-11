import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (name, email, password) => {
    setUser({
      name,
      email,
      password,
    });
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Al cargar, revisar si hay usuario guardado
  useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
