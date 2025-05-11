import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ roles, userComponent, posComponent }) {
  const { auth } = useAuth();
  
  if (!auth) {
    // Redirect to forbidden if the user is not authenticated
    return <Navigate to="/forbidden" replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    // Redirect to forbidden if the user's role is not allowed
    return <Navigate to="/forbidden" replace />;
  }

  // Render the appropriate component based on the user's role
  if (auth.role === "user" && userComponent) {
    return userComponent;
  }

  if (auth.role === "POS" && posComponent) {
    return posComponent;
  }

  // Default fallback (if no specific component is provided)
  return <Navigate to="/forbidden" replace />;
}
