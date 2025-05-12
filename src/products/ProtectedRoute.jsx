
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

export default function ProtectedRoute({ element, roles }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Redirect to forbidden if no token exists
    return <Navigate to="/forbidden" replace />;
  }

  let user;
  try {
    user = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/forbidden" replace />;
  }

  if (!user || (roles && !roles.includes(user.role))) {
    // Redirect to forbidden if the user is not authorized
    return <Navigate to="/forbidden" replace />;
  }

  // Render the protected element if authorized
  return element;
}