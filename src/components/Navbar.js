import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";

import Logo from "../assets/images/Logo.png";
import styles from './Navbar.module.css';

const Navbar = ({ userId, token }) => {
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [currentUserToken, setCurrentUserToken] = useState(token);
  const Navigate = useNavigate();
  console.log(localStorage.getItem("dashboard"));
  useEffect(() => {
    setCurrentUserId(userId);
    setCurrentUserToken(token);
  }, [userId, token]);

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: { sm: "123px", xs: "40px" },
    mt: { sm: "32px", xs: "20px" },
    backgroundColor: "#FF9B9B",  // Raspberry
    padding: "20px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    alignItems: "center",
  };

  const logoStyle = {
    width: "48px",
    height: "48px",
    margin: "0px 20px",
  };

  return (
    <Stack direction="row" sx={navbarStyle}>
      <Link to="/">
        <img src={Logo} alt="logo" style={logoStyle} />
      </Link>
      <Stack direction="row" gap="40px">
        <Link to="/Services" className={styles.linkStyle}>
          Services
        </Link>
        <Link to="/About" className={styles.linkStyle}>
          About
        </Link>
        <Link to="/Contact" className={styles.linkStyle}>
          Contact
        </Link>
        <Link to="/FAQ" className={styles.linkStyle}>
          FAQ
        </Link>
        <Link to={`/Dashboard?token=${token}&userId=${userId}`} className={styles.linkStyle}>
          Dashboard
        </Link>
        <Link to={`/BookAppointment?token=${token}&userId=${userId}`} className={styles.linkStyle}>
          Book Appointment
        </Link>
      </Stack>
      <a href="/Login" className={styles.loginButtonStyle}>
        Login
      </a>
    </Stack>
  );
};

export default Navbar;