import { createContext, useContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; 

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  // Load authentication data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get user info
        setAuth({ ...decoded, token });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("accessToken"); // Clear invalid token
      }
    }
  }, []);

  // Function to log in and save auth data
  const login = (token) => {
    try {
      const decoded = jwtDecode(token); // Decode the token to get user info
      setAuth({ ...decoded, token });
      localStorage.setItem("accessToken", token); // Save only the token
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  // Function to log out and clear auth data
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

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}