import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './components/ForbiddenAccess';
import Products from "./products/Products";
import InventoryDashboard from "./products/InventoryDashboard";
import POSAdminPage from './admin/POSAdminPage';
import UserProductPage from './user/UserProductPage';
import ProtectedRoute from "./products/ProtectedRoute";

const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { 
    path: '/products', 
    element: <ProtectedRoute element={<Products />} roles={['POS']}/> 
  },
  { 
    path: '/products/user', 
    element: <ProtectedRoute element={<UserProductPage />} roles={['user']}/> 
  },
  { path: '/inventory', element: <InventoryDashboard /> },
  { path: '/admin', element: <POSAdminPage /> },
  { path: '/forbidden', element: <ForbiddenAccess /> }
]

const router = createBrowserRouter(routes);

export default function Router() {
    return <RouterProvider router={router} />;
}