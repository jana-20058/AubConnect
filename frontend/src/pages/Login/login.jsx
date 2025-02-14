import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./login-style.css";
import "boxicons/css/boxicons.min.css";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form>
        <div className="group">
          <i className="bx bx-envelope group-i"></i>
          <input type="email" placeholder="Email" required />
        </div>

        <div className="group">
          <i
            className={`bx ${passwordVisible ? "bx-hide" : "bx-show"} group-i`}
            onClick={togglePassword}
          ></i>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="login-btn">Login</button>

        <div className="signup-redirect">
          New user? <Link to="/">Sign Up</Link> {/* or "/signup" if using Solution 2 */}
        </div>
      </form>
    </div>
  );
};

export default Login;
