import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './components/ForbiddenAccess';
import Products from "./products/Products";
import InventoryDashboard from "./products/InventoryDashboard";
import POSAdminPage from './admin/POSAdminPage';
import UserProductPage from './user/UserProductPage';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { path: '/products', element: <Products /> },
  { path: '/products/user', element: <UserProductPage /> },
  { path: '/inventory', element: <InventoryDashboard /> }, // New route for inventory dashboard
  { path: '/admin', element: <POSAdminPage /> },
  { path: '/forbidden', element: <ForbiddenAccess /> },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}