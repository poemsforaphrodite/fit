import React from "react";
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

const App = () => {
  const location = useLocation();

  return (
    <Box width="400px" sx={{ width: { xl: "1488px" } }} m="auto">
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/BookAppointment" element={<BookAppointment />} />
      </Routes>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Footer />
      )}
    </Box>
  );
};

export default App;
