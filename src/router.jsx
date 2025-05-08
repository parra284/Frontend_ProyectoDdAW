import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ForbiddenAccess from './components/ForbiddenAccess'
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import Products from "./products/Products";
import { useAuth } from "./contexts/AuthContext";

const routes = [
  { 
    path: '/', 
    element: <Navigate to="/login" replace />,
    auth: false
  },
  { 
    path: '/forbidden', 
    element: <ForbiddenAccess />,
    auth: false
  },
  { 
    path: '/signup', 
    element: <SignUp />,
    auth: false
  },
  { 
    path: '/login', 
    element: <LogIn />,
    auth: false
  },
  { 
    path: '/products', 
    element: <Products />,
    auth: true
  },
]

export default function Router() {
  const { auth } = useAuth();

  const router = createBrowserRouter(
    routes.map((route) => {
      if (route.auth && !auth) {
        return { ...route, element: <Navigate to="/forbidden" replace />};
      }
      return route;
    })  
  );

    return <RouterProvider router={router} />;
}