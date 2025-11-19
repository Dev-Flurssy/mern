import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticate, signin } from "../../apis/authApi.js";
import { redirectByRole } from "../../apis/helperApi.js";
import "../../styles/Auth.css";

export default function Signin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: "" });

    try {
      const data = await signin({
        email: values.email,
        password: values.password,
      });

      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        // ✅ Save token and redirect safely
        authenticate(data, () => {
          // wait a moment for localStorage to fully update before route guards check it
          setTimeout(() => {
            redirectByRole(navigate, data.user.role);
          }, 150);
        });
      }
    } catch (err) {
      setValues({
        ...values,
        error: "Signin failed. Please try again.",
        loading: false,
      });
    }
  };

  return (
    <main className="auth-page single-column">
      <div className="auth-form">
        <h2>Sign In</h2>

        {values.error && <p className="error-message">{values.error}</p>}
        {values.loading && <p>Signing in...</p>}

        <form onSubmit={clickSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={values.loading}
          >
            {values.loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="redirect-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
