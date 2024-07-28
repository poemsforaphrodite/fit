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
import { useLocation, useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripePromise = loadStripe(
    "pk_test_51NUTGeSIumqhegZiJ8KVV7FwNrNEEk9JDWghGuW4IgwsNcFkHaExBt5OYo0TYi5LSpmHa6UQnx9hE3Bgyjih9Nyu00wF1xAnYm"
  );
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
  const onToken = async (token) => {
    try {
      const response = await axios.post("https://fit-api.vercel.app/charge", {
        stripeToken: token.id,
        // include any other information you need
      });

      if (response.data.status === "succeeded") {
        console.log("Payment succeeded");
        // handle successful payment
      } else {
        console.log("Payment failed");
        // handle failed payment
      }
    } catch (error) {
      console.log("Payment error: ", error);
      // handle error
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log("useEffect triggered");
      let fetchedToken = getQueryParam("token");
      let fetchedUserId = getQueryParam("userId");

      // If not in query params, try to get from localStorage
      if (!fetchedToken || fetchedToken === "null") {
        fetchedToken = localStorage.getItem("token");
      }
      if (!fetchedUserId || fetchedUserId === "null") {
        fetchedUserId = localStorage.getItem("userId");
      }

      console.log("Token:", fetchedToken);
      console.log("UserId:", fetchedUserId);

      if (!fetchedToken || !fetchedUserId) {
        navigate("/Login");
      } else {
        // Set states and save to localStorage
        setToken(fetchedToken);
        setUserId(fetchedUserId);
        localStorage.setItem("token", fetchedToken);
        localStorage.setItem("userId", fetchedUserId);
      }
    };

    fetchData();
  }, [location, navigate]);
  const handleBookAppointment = async () => {
    try {
      const response = await axios.post(
        "https://fit-api.vercel.app/create-checkout-session",
        {
          token,
          userId,
          therapistId: 1,
          appointmentDate: date,
          appointmentTime: time,
          status: "pending",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const stripe = await stripePromise;
      const checkoutSession = await response.data;
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (result.error) {
        console.error("Error redirecting to checkout:", error);
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
            backgroundColor: "#FFFEC4",
            borderRadius: 1,
            padding: 3,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <Typography
                variant="h4"
                align="center"
                sx={{ color: "#0093f7", marginBottom: 2 }}
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
                    color: "#333",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#333",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
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
                    color: "#333",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#333",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
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
                  color: "#333",
                  backgroundColor: "#ddd",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ddd",
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
                  backgroundColor: "#0093f7",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0073e6",
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