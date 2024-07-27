import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css'; // Import the CSS file here

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("fit-api.vercel.app/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userId = response.data.userId;
        const authToken = response.data.token;
        onLogin(userId, authToken);
        localStorage.setItem("token", authToken);
        Navigate(response.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Login">
      <form className="Login-form" onSubmit={handleSubmit}>
        <input
          type="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          className="Login-input"
        />
        <input
          type="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          className="Login-input"
        />
        <input
          type="submit"
          value="Login"
          className="Login-submit"
        />
      </form>
      <br />
      <Link
        to="/signup"
        className="Login-signup"
      >
        Signup
      </Link>
      <br />
      <Link
        to="/"
        className="Go-home"
      >
        Go to Home Page
      </Link>
    </div>
  );
}

export default Login;