import React, { useState } from "react";
import "../styles/LoginPage.css";
import "../App.css";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { token } = await loginUser(email, password);

      if (keepLoggedIn) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Failed to login");
    }
  };

  return (
    <main className="login-page">
      <div className="container">
        <section className="container-card">
          <div className="form-container">
            <h1>Welcome back</h1>
            <p>Please enter your credentials to continue</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="email">
                Email<span>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="example@scooteq.de"
              />
              <label htmlFor="password">
                Password<span>*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="*********"
              />
              <div className="checkbox-container">
                <div className="checkbox">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  />
                  <label htmlFor="checkbox" id="logged-in">
                    Keep Me Logged in
                  </label>
                </div>
                <div className="forgot-password">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit">Submit</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
