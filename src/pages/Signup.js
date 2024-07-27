import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Import the CSS file here
function Signup() {
  const history = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("fit-api.vercel.app/signup", {
        email,
        password,
      });
      
      if (response.data === "exist") {
        alert("User already exists");
      } else if (response.data === "not exist") {
        history("/home", { state: { id: email } });
      } else {
        alert("Error occurred during signup");
      }
    } catch (err) {
      console.log("Axios post error:", err);
      alert("An error occurred. Please try again.");
    }
  }
  return (
    <div className="Signup">
      <form className="Signup-form" onSubmit={submit}>
        <input
          type="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          className="Signup-input"
        />
        <input
          type="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          className="Signup-input"
        />
        <input type="submit" value="Signup" className="Signup-submit" />
      </form>
      <br />
      <Link to="/Login" className="Login-link">
        Login
      </Link>
    </div>
  );
}

export default Signup;