import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-bold">Loading authorization...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
