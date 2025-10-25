import React, { useState } from "react";
import "../../styles/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      setMessage("");
    } else {
      setMessage("Password reset link has been sent to your email!");
      setError("");
      setEmail("");
    }
  };

  return (
    <main className="auth-page single-column">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && (
            <p style={{ color: "#3f4771", textAlign: "center" }}>{message}</p>
          )}

          <button type="submit" className="btn-primary">
            Send Reset Link
          </button>

          <p className="redirect-text">
            Back to <a href="/signin">Sign In</a>
          </p>
        </form>
      </div>
    </main>
  );
}
