import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Logo from "../assets/images/Logo.png";
import styles from './Navbar.module.css';

const Navbar = ({ userId, token }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoggedIn(!!userId && !!token);
  }, [userId, token]);

  const handleLogout = () => {
    // Clear user data from localStorage or your state management system
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    // Update the logged-in state
    setIsLoggedIn(false);
    // Redirect to home page or login page
    navigate('/');
  };

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
          {isLoggedIn && (
            <>
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
            </>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={2}>
        {isLoggedIn ? (
          <button onClick={handleLogout} className={styles.loginButtonStyle}>
            Logout
          </button>
        ) : (
          <Link to="/Login" className={styles.loginButtonStyle}>
            Login
          </Link>
        )}
      </Grid>
    </Grid>
  );
};

export default Navbar;