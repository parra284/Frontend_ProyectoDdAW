import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './auth/ForbiddenAccess';
import AuditLogPage from './products/AuditLogPage';
import ProtectedRoute from "./auth/ProtectedRoute";
import NotificationSystem from "./components/NotificationSystem";
import ProductsPOS from "./products/ProductsPOS";
import ProductsUser from "./products/ProductsUser"

const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { 
    path: '/products', 
    element: <ProtectedRoute elements={[<ProductsPOS />, <ProductsUser />]} roles={['POS','user']}/> 
  },
  { path: '/forbidden', element: <ForbiddenAccess /> },
  { path: '/audit-logs', element: <ProtectedRoute elements={<AuditLogPage />} roles={['POS', 'admin']}/> }
]

const router = createBrowserRouter(routes);

export default function Router() {
  return (
    <>
      <NotificationSystem position="bottom-right" />
      <RouterProvider router={router} />
    </> 
  );
}