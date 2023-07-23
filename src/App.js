import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookAppointment from "./pages/BookAppointment";

import Cat from "./components/Cat"; // Don't forget to import the Cat component

const App = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const handleLogin = (uid, authToken) => {
    setUserId(uid);
    setToken(authToken);
  };

  return (
    <Box width="400px" sx={{ width: { xl: "1488px" }, backgroundColor: "#FF9B9B" }} m="auto">
      {location.pathname !== "/Login" && location.pathname !== "/signup" && (
        <Navbar userId={userId} token={token} />
      )}
      <Cat /> {/* Add the Cat component here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login onLogin={handleLogin} />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
      </Routes>
      {location.pathname !== "/Login" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </Box>
  );
};

export default App;