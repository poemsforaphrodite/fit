import React, { useState, useEffect } from "react";
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
  const bookAppointmentUrl = window.localStorage.getItem("bookAppointmentUrl");
  const linkStyle = {
    textDecoration: "none",
    color: "#FFFFFF",
    transition: "0.3s",
    ":hover": {
      color: "#FFD700",
    },
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{
        gap: { sm: "123px", xs: "40px" },
        mt: { sm: "32px", xs: "20px" },
        justifyContent: "none",
        backgroundColor: "#3A3212",
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
          <Link to="/Services" style={linkStyle}>
            Services
          </Link>
          <Link to="/About" style={linkStyle}>
            About
          </Link>
          <Link to="/Contact" style={linkStyle}>
            Contact
          </Link>
          <Link to="/FAQ" style={linkStyle}>
            FAQ
          </Link>
          <Link to="/Dashboard" style={linkStyle}>
            Dashboard
          </Link>
          <Link to={bookAppointmentUrl} style={linkStyle}>
            Book Appointment
          </Link>
        </Stack>
      </Stack>
      <a
        href="/Login"
        style={{
          textDecoration: "none",
          color: "#FFFFFF",
          backgroundColor: "#FF2625",
          padding: "10px 20px",
          borderRadius: "5px",
          transition: "0.3s",
          ":hover": {
            backgroundColor: "#FFD700",
          },
        }}
      >
        Login
      </a>
    </Stack>
  );
};

export default Navbar;
