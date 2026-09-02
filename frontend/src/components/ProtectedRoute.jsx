import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

// Allows access to any logged-in user (USER or ADMIN)
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Allows access only to logged-in ADMIN users
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
