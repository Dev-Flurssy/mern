import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";

/**
 * @param {React.Component} children
 * @param {string} role
 */
export default function ProtectedRoute({ children, role }) {
  const auth = isAuthenticated();

  if (!auth || !auth.user) {
    return <Navigate to="/signin" replace />;
  }

  if (role && auth.user.role !== role) {
    return auth.user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/user/home" replace />
    );
  }

  return children;
}
