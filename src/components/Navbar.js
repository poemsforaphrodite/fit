import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
import { Grid } from "@mui/material";
import Logo from "../assets/images/Logo.png";
import styles from './Navbar.module.css';

const Navbar = ({ userId, token }) => {
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [currentUserToken, setCurrentUserToken] = useState(token);
  const Navigate = useNavigate();
  
  useEffect(() => {
    setCurrentUserId(userId);
    setCurrentUserToken(token);
  }, [userId, token]);

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
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
    <Grid container justifyContent="space-between" alignItems="center" sx={navbarStyle}>
      <Grid item xs={12} sm={2}>
        <Link to="/">
          <img src={Logo} alt="logo" style={logoStyle} />
        </Link>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Link to="/Services" className={styles.linkStyle}>
              Services
            </Link>
          </Grid>
          <Grid item>
            <Link to="/About" className={styles.linkStyle}>
              About
            </Link>
          </Grid>
          <Grid item>
            <Link to="/Contact" className={styles.linkStyle}>
              Contact
            </Link>
          </Grid>
          <Grid item>
            <Link to="/FAQ" className={styles.linkStyle}>
              FAQ
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/Dashboard?token=${token}&userId=${userId}`} className={styles.linkStyle}>
              Dashboard
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/BookAppointment?token=${token}&userId=${userId}`} className={styles.linkStyle}>
              Book Appointment
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={2}>
        <a href="/Login" className={styles.loginButtonStyle}>
          Login
        </a>
      </Grid>
    </Grid>
  );
};
export default Navbar;