import pic3 from "../assets/chatter-male-2.jpg";
import "../styles/Signup.css";

export default function Signup() {
  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="signup-info">
          <h2>Join Chatterhub Today</h2>
          <p>
            Connect, chat, and share with people who matter most.
            <br />
            Sign up in just a few seconds!
          </p>
          <img src={pic3} alt="Sign up" />
        </div>

        <div className="signup-form">
          <h2>Create an Account</h2>
          <form>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" required />
            </div>
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="redirect-text">
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
