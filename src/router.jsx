import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './auth/ForbiddenAccess';
import ProtectedRoute from "./auth/ProtectedRoute";
import NotificationSystem from "./components/NotificationSystem";
import ProductsPOS from "./products/ProductsPOS";
import ProductsUser from "./products/ProductsUser";
import ProductDetails from "./products/ProductDetails";
import Orders from "./orders/Orders";

const routes = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },  { 
    path: '/products', 
    element: <ProtectedRoute elements={[<ProductsPOS />, <ProductsUser />]} roles={['POS','user']}/> 
  },
  { path: '/forbidden', element: <ForbiddenAccess /> },
  { path: '/orders', element: <ProtectedRoute elements={<Orders />} roles={['POS']} /> },
  { path: '/products/:productId', element: <ProtectedRoute elements={<ProductDetails />} roles={['POS', 'user']} /> }
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