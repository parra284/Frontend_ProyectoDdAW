import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import ForbiddenAccess from './components/ForbiddenAccess';

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <LogIn /> },
  { path: '/forbidden', element: <ForbiddenAccess /> }, // New route for forbidden access
]);

export default function Router() {
    return <RouterProvider router={router} />;
}