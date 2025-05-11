//NEEDED
//ROLE BASED AND TOKEN REFRESH

import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode"; 

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  const decodeToken = (token) => {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }
    return decoded;
  }

  // Function to log in and save auth data
  const login = (token) => {
    try {
      const decoded = decodeToken(token);
      setAuth({ ...decoded, token });
      localStorage.setItem("accessToken", token); // Save only the token

      const timeout = decoded.exp * 1000 - Date.now();
      console.log(timeout);
      
      setTimeout(logout, timeout);
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
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