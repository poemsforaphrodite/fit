import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Logo from '../assets/images/Logo2.png';

const Footer = () => (
  <Box mt="100px" bgcolor="#FF9B9B">
    <Stack gap="40px" sx={{ alignItems: 'center' }} flexWrap="wrap" px="100px" pt="24px">
      <img src={Logo} alt="logo" style={{ width: '250px', height: '41%' }} />
    </Stack>
    <Typography variant="h5" sx={{ fontSize: { lg: '28px', xs: '20px' } }} mt="41px" textAlign="center" pb="40px">Made with love </Typography>
  </Box>
);

const App = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Box sx={{ flex: '1 0 auto' }}>
      {/* Your main content goes here */}
    </Box>
    <Footer />
  </Box>
);

export default App;
