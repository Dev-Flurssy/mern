import { useNavigate } from "react-router-dom";
import { remove } from "../apis/userApi.js";
import { clearJWT } from "../apis/authApi.js";
import "../styles/Auth.css";

export default function DeleteUser({ userId }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    const jwt = JSON.parse(sessionStorage.getItem("jwt"));

    remove({ userId }, { t: jwt.token })
      .then((data) => {
        if (data && data.error) {
          console.error("Delete failed:", data.error);
        } else {
          clearJWT(() => {
            navigate("/", { replace: true });
          });
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <button className="btn-danger" onClick={handleDelete}>
      Delete Account
    </button>
  );
}
