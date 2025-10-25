import { useNavigate } from "react-router-dom";
import { isAuthenticated, clearJWT } from "../apis/authApi.js";
import "../styles/AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const auth = isAuthenticated();

  const handleSignout = () => {
    clearJWT(() => navigate("/signin"));
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h2>ChatterHub Admin</h2>
      </div>
      <div className="admin-header-right">
        <span className="admin-name">👋 Hi, {auth?.user?.name || "Admin"}</span>
        <button className="btn-danger" onClick={handleSignout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
