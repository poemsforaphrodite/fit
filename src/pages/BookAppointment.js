import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const BookAppointment = ({ userId }) => {
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [time, setTime] = useState('');
  const [therapist, setTherapist] = useState('');

  const therapists = ['Therapist 1', 'Therapist 2', 'Therapist 3']; // Replace with actual data

  const handleBookAppointment = async () => {
    try {
      const response = await axios.post('http://localhost:8000/BookAppointment', {
        userId: userId,
        therapistId: 1, // Replace with actual therapist ID
        appointmentDate: date,
        appointmentTime: time,
        status: 'pending',
      });
      console.log(response);
      if (response.data) {
        alert('Booked');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Book an Appointment
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Select fullWidth value={therapist} onChange={(e) => setTherapist(e.target.value)}>
          {therapists.map((therapist, index) => (
            <MenuItem key={index} value={therapist}>
              {therapist}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleBookAppointment} fullWidth>
          Book Appointment
        </Button>
      </Grid>
    </Grid>
  );
};

export default BookAppointment;
