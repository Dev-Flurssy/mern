import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Header.css";

const Header = () => {
  const { user, signout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <h1>🗨️ ChatterHub</h1>
      </div>

      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={signout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
