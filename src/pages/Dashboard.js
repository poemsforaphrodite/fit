import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import { Slider, Typography, Paper, Grid, Box, TextField, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const Dashboard = () => {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [upcomingMeeting, setUpcomingMeeting] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [age, setAge] = useState(12);
  const [weight, setWeight] = useState(50);
  const [height, setHeight] = useState(150);
  const [currentBodyFat, setCurrentBodyFat] = useState(20);
  const [desiredBodyFat, setDesiredBodyFat] = useState(15);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setUserId(searchParams.get("userId") || "");
    setToken(searchParams.get("token") || "");
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8000/user/${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();
          if (userData.appointmentDate && userData.appointmentTime) {
            setUpcomingMeeting({
              date: userData.appointmentDate,
              time: userData.appointmentTime,
              zoomLink: userData.zoomMeetingJoinUrl
            });
          }
          if (userData.workoutPlan) {
            setWorkoutPlan(userData.workoutPlan);
          }
          setAge(userData.age || 12);
          setWeight(userData.weight || 50);
          setHeight(userData.height || 150);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async () => {
    if (userId) {
      const url = `http://localhost:8000/user/${userId}`;
      console.log('Sending request to:', url);
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            age,
            weight,
            height,
            currentBodyFat,
            desiredBodyFat,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('User data updated successfully!');
      } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update user data. Please try again.');
      }
    }
  };

  const containerStyle = {
    display: "flex",
    backgroundColor: "#FFD4D4",
    minHeight: "100vh",
    padding: "20px",
  };

  const sidebarStyle = {
    width: "300px",
    marginRight: "20px",
  };

  const contentStyle = {
    flex: 1,
    maxWidth: "800px",
  };

  const paperStyle = {
    backgroundColor: "#FFFEC4",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={sidebarStyle}>
        <Paper elevation={3} sx={paperStyle}>
          <Typography variant="h6" gutterBottom>Your Stats</Typography>
          <Box mb={2}>
            <Typography gutterBottom>Age: {age}</Typography>
            <Slider
              value={age}
              onChange={(_, newValue) => setAge(newValue)}
              min={5}
              max={100}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mb={2}>
            <Typography gutterBottom>Weight (kg): {weight}</Typography>
            <Slider
              value={weight}
              onChange={(_, newValue) => setWeight(newValue)}
              min={20}
              max={200}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mb={2}>
            <Typography gutterBottom>Height (cm): {height}</Typography>
            <Slider
              value={height}
              onChange={(_, newValue) => setHeight(newValue)}
              min={100}
              max={250}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Current Body Fat %"
              type="number"
              value={currentBodyFat}
              onChange={(e) => setCurrentBodyFat(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Desired Body Fat %"
              type="number"
              value={desiredBodyFat}
              onChange={(e) => setDesiredBodyFat(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={contentStyle}>
        {upcomingMeeting && (
          <Paper elevation={3} sx={paperStyle}>
            <Typography variant="h5" gutterBottom>Upcoming Meeting</Typography>
            <Typography>Date: {format(new Date(upcomingMeeting.date), 'MMMM d, yyyy')}</Typography>
            <Typography>Time: {upcomingMeeting.time}</Typography>
            <Typography>
              Zoom Link:{' '}
              <a href={upcomingMeeting.zoomLink} target="_blank" rel="noopener noreferrer">
                Join Meeting
              </a>
            </Typography>
          </Paper>
        )}

        {workoutPlan && (
          <Paper elevation={3} sx={paperStyle}>
            <Typography variant="h5" gutterBottom>Your Workout Plan</Typography>
            <ReactMarkdown>{workoutPlan}</ReactMarkdown>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;