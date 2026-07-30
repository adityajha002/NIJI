import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = ({role}) => {
    const { user, token, loading } = useAuth();

    if (loading) return null; 

    if (!user || !token) return <Navigate to="/auth" replace />;
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
