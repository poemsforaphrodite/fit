import React ,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { Stack } from "@mui/material";

import Logo from "../assets/images/Logo.png";

const Navbar = ({ userId, token }) => {
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [currentUserToken, setCurrentUserToken] = useState(token);

  useEffect(() => {
    setCurrentUserId(userId);
    setCurrentUserToken(token);
  }, [userId, token]);
return(
  <Stack
    direction="row"
    justifyContent="space-around"
    sx={{
      gap: { sm: "123px", xs: "40px" },
      mt: { sm: "32px", xs: "20px" },
      justifyContent: "none",
    }}
    px="20px"
  >
    <Link to="/">
      <img
        src={Logo}
        alt="logo"
        style={{ width: "48px", height: "48px", margin: "0px 20px" }}
      />
    </Link>
    <Stack>
      <Stack direction="row" gap="40px">
        <Link
          to="/Services"
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          Services
        </Link>
        <Link to="/About" style={{ textDecoration: "none", color: "#3A1212" }}>
          About
        </Link>
        <Link
          to="/Contact"
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          Contact
        </Link>
        <Link to="/FAQ" style={{ textDecoration: "none", color: "#3A1212" }}>
          FAQ
        </Link>
        <Link
          to="/Dashboard"
          style={{ textDecoration: "none", color: "#3A1212" }}
        >
          Dashboard
        </Link>
        <Link
          to={`/bookappointment?token=${currentUserToken}&userId=${currentUserId}`}
        >
          Book Appointment
        </Link>
      </Stack>
    </Stack>
    <a
      href="/Login"
      style={{
        textDecoration: "none",
        color: "#FFFFFF",
        backgroundColor: "#3A3212",
        padding: "10px 20px",
        borderRadius: "5px",
        transition: "0.3s",
        ":hover": {
          backgroundColor: "#FF2625",
        },
      }}
    >
      Login
    </a>
  </Stack>
)
};

export default Navbar;
