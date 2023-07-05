import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

import Logo from '../assets/images/Logo.png';

const Navbar = () => (
  <Stack direction="row" justifyContent="space-around" sx={{ gap: { sm: '123px', xs: '40px' }, mt: { sm: '32px', xs: '20px' }, justifyContent: 'none' }} px="20px">
    <Link to="/">
      <img src={Logo} alt="logo" style={{ width: '48px', height: '48px', margin: '0px 20px' }} />
    </Link>
    <Stack
      direction="row"
      justifyContent="space-between"
      fontFamily="Alegreya"
      fontSize="24px"
      alignItems="flex-end"
      style={{ width: '100%' }}
    >
      <Stack direction="row" gap="40px">
        <a href="/Services" style={{ textDecoration: 'none', color: '#3A1212' }}>Services</a>
        <a href="/About" style={{ textDecoration: 'none', color: '#3A1212' }}>About</a>
        <a href="/Contact" style={{ textDecoration: 'none', color: '#3A1212' }}>Contact</a>
        <a href="/FAQ" style={{ textDecoration: 'none', color: '#3A1212' }}>FAQ</a>
        <a href="/Dashboard" style={{ textDecoration: 'none', color: '#3A1212' }}>Dashboard</a>
        <a href="/BookAppointment" style={{ textDecoration: 'none', color: '#3A1212' }}>Book Appointment</a>
      </Stack>
      <a href="/Login" style={{ 
        textDecoration: 'none', 
        color: '#FFFFFF', 
        backgroundColor: '#3A3212', 
        padding: '10px 20px', 
        borderRadius: '5px',
        transition: '0.3s',
        ':hover': {
          backgroundColor: '#FF2625',
        }
      }}>Login</a>
    </Stack>
  </Stack>
);

export default Navbar;
