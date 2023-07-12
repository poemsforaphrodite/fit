// src/pages/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Extract the userId and authToken from the response data
        const userId = response.data.userId;
        const authToken = response.data.token;
        //console.log(userId, authToken);
        // Pass the userId and authToken to the onLogin function
        onLogin(userId, authToken);

        // Store the token using your preferred method (e.g., localStorage, cookies, etc.)
        localStorage.setItem("token", authToken);

        // Redirect the user to the new URL received in the response
        Navigate(response.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="Login"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FF9B9B", // Changed the background color
      }}
    >
      <form
        action="POST"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <input
          type="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          name=" "
          id=" "
          placeholder="Email"
          style={{ margin: "10px 0", padding: "10px", width: "130%" }}
        />
        <input
          type="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          name=" "
          id=" "
          placeholder="Password"
          style={{ margin: "10px 0", padding: "10px", width: "130%" }}
        />
        <input
          type="submit"
          onClick={handleSubmit}
          value="Login"
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "130%",
            backgroundColor: "#FFD6A5",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        />
      </form>
      <br />
      <Link
        to="/signup"
        style={{ textAlign: "center", display: "block", color: "#FFD6A5" }}
      >
        Signup
      </Link>
    </div>
  );
}

export default Login;
