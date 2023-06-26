import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Dashboard from './pages/Dashboard';
//import Server from './pages/Server';

const App = () => (
  <Box width="400px" sx={{ width: { xl: '1488px' } }} m="auto">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path ="About" element={<About />} />
      <Route path="Services" element={<Services />} />
      <Route path ="Contact" element={<Contact />} />
      <Route path ="FAQ" element = {<FAQ />} />
      <Route path="Dashboard" element={<Dashboard />} />
    </Routes>
    <Footer />
  </Box>
);

export default App;
