import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../middleware/Loading";

const ProtectedRoute = ({ children }) => {
  const {
    authState: { authLoading, isAuthenticated, roles },
  } = useAuth();

  if (authLoading) {
    return <Loading />;
  }

  if (isAuthenticated && roles?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
