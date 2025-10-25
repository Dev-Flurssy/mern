import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../apis/authApi.js";

export function PrivateRoute({ requiredRole }) {
  const location = useLocation();
  const auth = isAuthenticated();

  if (!auth || !auth.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && auth.user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
