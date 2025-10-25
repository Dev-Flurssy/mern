import React from "react";
import "../styles/Auth.css";

export default function Signin() {
  return (
    <main className="auth-page single-column">
      <div className="auth-form">
        <h2>Sign In</h2>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
          <p className="redirect-text">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
          <p className="forgot-text">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </form>
      </div>
    </main>
  );
}
