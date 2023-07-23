// src/pages/Signup.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const history = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      await axios
        .post("http://localhost:8000/signup", {
          email,
          password,
        })
        .then((res) => {
          if (res.data == "exist") {
            alert("user already exists");
          } else if (res.data == "not exist") {
            history("/home", { state: { id: _id } });
          } else {
            alert("error");
          }
        })
        .catch((err) => {
          console.log("Axios post error:", err);
        });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div
      className="Login"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
          onClick={submit}
          value="Signup"
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
        to="/Login"
        style={{ textAlign: "center", display: "block", color: "#FFD6A5" }}
      >
        Login
      </Link>
    </div>
  );
}

export default Signup;
