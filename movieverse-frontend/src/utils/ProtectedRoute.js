import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return <Navigate to="/authentication" replace />;
  }

  return children;
};

export default ProtectedRoute;
