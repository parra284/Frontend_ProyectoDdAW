import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Use named import
import { initializeMessaging } from '../firebase/messaging';
import { isTokenExpired } from './authUtils';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("accessToken");
      } else {
        const decoded = jwtDecode(token);
        setAuth({ ...decoded, token });
      }
    }
  }, []);

  useEffect(() => {
    initializeMessaging();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    if (!isTokenExpired(token)) {
      const decoded = jwtDecode(token);
      setAuth({ ...decoded, token });
      localStorage.setItem("accessToken", token);
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Eliminar la exportación de `useAuth` para resolver el problema de Fast Refresh

export default AuthContext;