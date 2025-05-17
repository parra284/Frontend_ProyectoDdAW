import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

export default function ProtectedRoute({ elements, roles }) {
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

  if (!user) {
    return <Navigate to="/forbidden" replace />;
  }

  // Find the index of the matching role
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  const elementsArray = Array.isArray(elements) ? elements : [elements];

  // Find the index of the matching role
  const index = rolesArray.findIndex((role) => role === user.role);

  if (index === -1) {
    // Redirect to forbidden if the user is not authorized
    return <Navigate to="/forbidden" replace />;
  }

  // Render the protected element if authorized
  return elementsArray[index];
}