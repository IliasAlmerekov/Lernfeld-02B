import React, { useState } from "react";
import "../styles/Register.css";
import { registerUser } from "../api/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { token, userId } = await registerUser(email, password, name, role);
      if (token) {
        localStorage.setItem("tokoen", token);
        sessionStorage.setItem("userId", userId);
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };
  return (
    <div className="register-page">
      <div className="container">
        <section className="register-card">
          <div className="register-container">
            <h1>Create an account</h1>
            <p>Please fill in the details to create your account</p>
            <form className="register-form" onSubmit={handleSubmit}>
              <label htmlFor="email">
                Email<span>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="name.surname@scooteq.de"
              />
              <label htmlFor="password">
                Password<span>*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="**********"
              />
              <label htmlFor="name">
                Name<span>*</span>
              </label>
              <input
                type="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your full name"
              />
              <label htmlFor="role">
                Role<span>*</span>
              </label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                autoComplete="role"
                placeholder="user/admin"
              />
              {error && <p className="error-message">{error}</p>}
              {success && (
                <p className="success-message">
                  Registration successful! Redirecting to login...
                </p>
              )}
              <button type="submit">Registration</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
