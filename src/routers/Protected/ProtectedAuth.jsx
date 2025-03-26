import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts//AuthContext";
import Loading from "../../middleware/Loading";

const ProtectedAuth = ({ children }) => {
  const {
    authState: { roles, authLoading, isAuthenticated },
  } = useAuth();

  if (authLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !roles?.includes("admin")) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedAuth;
