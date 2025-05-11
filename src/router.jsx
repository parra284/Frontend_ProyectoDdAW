import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ForbiddenAccess from './components/ForbiddenAccess'
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ProductsUser from './products/ProductsUser'
import ProductsPOS from "./products/ProductsPOS";
import ProtectedRoute from "./utils/ProtectedRoute";

const routes = [
  { 
    path: '/', 
    element: <Navigate to="/login" replace />
  },
  { 
    path: '/forbidden', 
    element: <ForbiddenAccess />
  },
  { 
    path: '/signup', 
    element: <SignUp />
  },
  { 
    path: '/login', 
    element: <LogIn />
  },
  { 
    path: '/products', 
    element: <ProtectedRoute
      roles={['user', 'POS']}
      userComponent={<ProductsUser />}
      posComponent={<ProductsPOS />}
    />
  },
]

export default function Router() {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}