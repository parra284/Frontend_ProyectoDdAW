import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignUp from './auth/SignUp';

const router = createBrowserRouter([
    {path: "/", element: <Navigate to="/signup" replace />},
    {path: "/signup", element: <SignUp />}
]);

export default function Router() {
    return <RouterProvider router={router} />;
}