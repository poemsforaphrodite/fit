// src/pages/Home.js
import React, { useState } from 'react';
import { Box } from '@mui/material';


import HeroBanner from '../components/HeroBanner';

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');

  return (
    <Box sx={{ backgroundColor: '#FF9B9B' }}>
      <HeroBanner />
    </Box>
  );
};

export default Home;
