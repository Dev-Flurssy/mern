import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../apis/userApi.js";
import { isAuthenticated } from "../../apis/authApi.js";
import "../../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = isAuthenticated();

  const handleSignout = () => {
    clearAuth(() => navigate("/signin"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/posts" className="navbar-brand">
          <h1>Chatterhub</h1>
        </Link>
      </div>

      <div className="navbar-links">
        {auth && auth.user ? (
          <>
            <span className="welcome">Hi, {auth.user.name}</span>
            <Link to="/posts" className="nav-btn">
              Posts
            </Link>
            <Link to={`/user/${auth.user._id}`} className="nav-btn profile-btn">
              Profile
            </Link>
            <Link to="/post/create" className="nav-btn">
              Create
            </Link>
            <Link to="/users" className="nav-btn">
              Users
            </Link>
            <button className="nav-btn logout-btn" onClick={handleSignout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="nav-btn">
              Sign In
            </Link>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
