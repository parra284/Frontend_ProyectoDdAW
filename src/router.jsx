import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';

const router = createBrowserRouter([
  {path: "/", element: <Navigate to="/login" replace />},
  {path: "/signup", element: <SignUp />},
  {path: "/login", element: <LogIn />}
]);

export default function Router() {
    return <RouterProvider router={router} />;
}