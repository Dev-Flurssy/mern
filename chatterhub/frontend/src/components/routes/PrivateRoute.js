import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";

/**
 * Protect routes based on authentication & role
 * @param {string} requiredRole - "user" or "admin"
 */
export function PrivateRoute({ requiredRole }) {
  const location = useLocation();
  const auth = isAuthenticated();

  // Not logged in
  if (!auth || !auth.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Logged in but role mismatch
  if (requiredRole && auth.user.role !== requiredRole) {
    return auth.user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/posts" replace />
    );
  }

  // Authenticated & role matches
  return <Outlet />;
}
