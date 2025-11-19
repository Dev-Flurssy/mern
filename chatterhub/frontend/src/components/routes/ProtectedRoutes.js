import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";
import { useState, useEffect } from "react";

/**
 * @param {React.ReactNode} children - components to render if authorized
 * @param {string} role - required role for this route
 */
export default function ProtectedRoute({ children, role }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Safely get auth from localStorage
    const result = isAuthenticated();
    setAuth(result);
    setAuthChecked(true);
  }, []);

  // Show loading until auth is checked
  if (!authChecked) return <div>Loading...</div>;

  // User not authenticated → redirect to /signin
  if (!auth || !auth.user) {
    return <Navigate to="/signin" replace />; // ✅ no state, no "?"
  }

  // User does not have the required role
  if (role && auth.user.role !== role) {
    return auth.user.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/posts" replace />
    );
  }

  // User is authenticated and authorized → render children
  return children;
}
