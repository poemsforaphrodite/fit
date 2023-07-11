// src/pages/BookAppointment.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BookAppointment = () => {
  const location = useLocation();

  // Function to parse query parameters
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name);
  };
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  const formattedTime = currentDate.toISOString().slice(11, 16);
  const [date, setDate] = useState(formattedDate);
  const [time, setTime] = useState(formattedTime);
  const [therapist, setTherapist] = useState("");
  //TODO:add current appointments
  // List of therapists
  const therapists = ["Therapist A", "Therapist B", "Therapist C"];

  useEffect(() => {
    const fetchData = async () => {
      console.log("useEffect triggered");
      setToken(getQueryParam("token"));
      setUserId(getQueryParam("userId"));
      console.log("Token from query param:", getQueryParam("token"));
      console.log("UserId from query param:", getQueryParam("userId"));
    };

    fetchData();
  }, [location]);
  const handleBookAppointment = async () => {
    // console.log("handleBookAppointment called");
    // console.log("Token being sent:", token); // Log the token being sent
    // console.log("UserId being sent:", userId); // Log the userId being sent
    // console.log("Date being sent:", date);
    // console.log("Time being sent:", time);

    try {
      const response = await axios.post(
        "http://localhost:8000/BookAppointment",
        {
          userId, // Add userId to the request body
          therapistId: 1, // Replace with actual therapist ID
          appointmentDate: date,
          appointmentTime: time,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        }
      );

      console.log("Response from server:", response);

      if (response.data) {
        console.log("Appointment booked");
        alert("Booked");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FF9B9B",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "#36393F",
            borderRadius: 1,
            padding: 3,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Typography
                variant="h4"
                align="center"
                sx={{ color: "#FFFFFF", marginBottom: 2 }}
              >
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
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#FFFFFF",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#B9BBBE",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40444B",
                  },
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
                sx={{
                  "& .MuiInputBase-root": {
                    color: "#FFFFFF",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#B9BBBE",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40444B",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={therapist}
                onChange={(e) => setTherapist(e.target.value)}
                sx={{
                  color: "#FFFFFF",
                  backgroundColor: "#40444B",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#40444B",
                  },
                }}
              >
                {therapists.map((therapist, index) => (
                  <MenuItem key={index} value={therapist}>
                    {therapist}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBookAppointment}
                fullWidth
                sx={{
                  backgroundColor: "#FFD6A5",
                  "&:hover": {
                    backgroundColor: "#FF9B9B",
                  },
                }}
              >
                Book Appointment
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BookAppointment;
