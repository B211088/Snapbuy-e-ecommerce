import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/User/AuthContext";
import Loading from "../views/client/pages/Loading";
import { useState } from "react";
const ProtectedRouteShop = ({ children }) => {
  const location = useLocation();

  const {
    authState: { authLoading, isAuthenticated, roles },
  } = useAuth();

  if (authLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles?.includes("shop")) {
    return <Navigate to="/salesregistation/formregister" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRouteShop;
