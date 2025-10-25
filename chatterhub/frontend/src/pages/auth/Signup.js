import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../../apis/authApi.js";
import "../../styles/Auth.css";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    open: false,
    error: "",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    signup(user)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            open: true,
          });
          alert("✅ Account created successfully!");
        }
      })
      .catch((err) => {
        setValues({ ...values, error: err.message });
      });
  };

  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="signup-info">
          <div className="overlay">
            <h2>Join Chatterhub Today</h2>
            <p>
              Connect, chat, and share with people who matter most.
              <br />
              Sign up in just a few seconds!
            </p>
          </div>
        </div>

        <div className="signup-form">
          <h2>Create an Account</h2>
          {values.error && <p className="error-message">{values.error}</p>}

          <form onSubmit={clickSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={values.name}
                onChange={handleChange("name")}
                required
              />
            </div>

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

            <button type="submit" className="btn-primary">
              Sign Up
            </button>

            <p className="redirect-text">
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
