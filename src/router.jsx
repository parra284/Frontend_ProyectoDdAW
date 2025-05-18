import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './auth/ForbiddenAccess';
import InventoryReports from './products/InventoryReports';
import AuditLogPage from './products/AuditLogPage';
import ProtectedRoute from "./auth/ProtectedRoute";
import ResponsiveDemo from "./components/ResponsiveDemo";
import NotificationSystem from "./components/NotificationSystem";
import InventoryDashboard from "./products/InventoryDashboard";
import ProductsPOS from "./products/ProductsPOS";
import ProductsUser from "./products/ProductsUser"
import RecentOrders from './products/RecentOrders';

const user = JSON.parse(localStorage.getItem('user')) || {}; // Retrieve user info
const userRole = user.role || 'guest'; // Default to 'guest' if no role is found;

const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { 
    path: '/products', 
    element: <ProtectedRoute elements={[<ProductsPOS userRole={userRole} />, <ProductsUser userRole={userRole} />]} roles={['POS','user']}/> 
  },
  { path: '/forbidden', element: <ForbiddenAccess /> },  { path: '/responsive-demo', element: <ResponsiveDemo /> },
  { path: '/inventory', element: <ProtectedRoute elements={<InventoryDashboard />} roles={['POS']}/> },
  { path: '/inventory/reports', element: <ProtectedRoute elements={<InventoryReports />} roles={['POS', 'admin']}/> },
  { path: '/audit-logs', element: <ProtectedRoute elements={<AuditLogPage />} roles={['POS', 'admin']}/> },
  { path: '/recent-orders', element: <ProtectedRoute elements={<RecentOrders location={user.location} />} roles={['POS']} /> }
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