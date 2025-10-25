import React from "react";
import "../styles/Auth.css";

export default function ForgotPassword() {
  return (
    <main className="auth-page single-column">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <p className="form-subtext">
          Enter your email and we’ll send you instructions to reset your
          password.
        </p>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <button type="submit" className="btn-primary">
            Send Reset Link
          </button>
          <p className="redirect-text">
            Remember your password? <a href="/signin">Back to Sign In</a>
          </p>
        </form>
      </div>
    </main>
  );
}
