import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenAccess() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    const timer = setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" role="alert" aria-live="assertive">
      <h1 className="text-red-500 text-3xl font-bold">Forbidden Access</h1>
      <p className="text-gray-700 text-lg">You do not have permission to access this resource.</p>
    </div>
  );
}