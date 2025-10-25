import { useNavigate } from "react-router-dom";
import "../styles/Error.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="error-page">
      <div className="error-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </main>
  );
}
