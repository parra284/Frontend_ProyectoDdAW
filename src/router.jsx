import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './auth/ForbiddenAccess';
import POSAdminPage from './products/POSAdminPage';
import UserProductPage from './products/UserProductPage';
import InventoryReports from './products/InventoryReports';
import AuditLogPage from './products/AuditLogPage';
import ProtectedRoute from "./auth/ProtectedRoute";
import ResponsiveDemo from "./components/ResponsiveDemo";
import NotificationSystem from "./components/NotificationSystem";
import InventoryDashboard from "./products/InventoryDashboard";

const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { 
    path: '/products', 
    element: <ProtectedRoute element={<POSAdminPage />} roles={['POS']}/> 
  },
  { 
    path: '/products/user', 
    element: <ProtectedRoute element={<UserProductPage />} roles={['user']}/> 
  },  { path: '/admin', element: <POSAdminPage /> },
  { path: '/forbidden', element: <ForbiddenAccess /> },  { path: '/responsive-demo', element: <ResponsiveDemo /> },
  { path: '/inventory', element: <ProtectedRoute element={<InventoryDashboard />} roles={['POS']}/> },
  { path: '/inventory/reports', element: <ProtectedRoute element={<InventoryReports />} roles={['POS', 'admin']}/> },
  { path: '/audit-logs', element: <ProtectedRoute element={<AuditLogPage />} roles={['POS', 'admin']}/> }
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