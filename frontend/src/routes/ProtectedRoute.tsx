import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  role?: string;
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();

  if (loading) return null;

  if (!user || !token) return <Navigate to="/auth" replace />;
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
