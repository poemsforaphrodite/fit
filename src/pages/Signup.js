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
      await axios
        .post("https://fit-api.vercel.app/signup", {
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
