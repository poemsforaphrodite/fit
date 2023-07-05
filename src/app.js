const express = require("express");
require("dotenv").config();
const  User = require("./mongo"); // Updated import
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
  res.send("Hello Worldsssssss");
});

app.post("/login", cors(), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ email: email }, "secret-key");
        //send token to
        res.json("Logged in successfully");
      } else {
        res.json("Incorrect password");
      }
    } else {
      res.json("Email does not exist");
    }
  } catch (e) {
    res.json(e);
  }
});

app.post("/signup", cors(), async (req, res) => {
  const { email, password } = req.body;
  const data = {
    email: email,
    password: password,
  };
  try {
    const check = await User.findOne({ email: email });
    if (check) {
      res.json("exist");
    } else {
      await User.insertMany([data]);
      res.json("not exist");
    }
  } catch (e) {
    res.json(e);
  }
});

app.post("/update", cors(), async (req, res) => {
  const { email, age, weight, height, fitnessGoals } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.age = age;
      user.weight = weight;
      user.height = height;
      user.fitnessGoals = fitnessGoals;
      await user.save();
      res.json("User updated successfully");
    } else {
      res.json("User not found");
    }
  } catch (e) {
    res.json(e);
  }
});
app.post("/BookAppointment", cors(), async (req, res) => {
  console.log("Request body:", req.body);
  const { token, therapistId, appointmentDate, appointmentTime } = req.body;

  try {
    // Verify the token
    jwt.verify(token, "secret-key", async (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      const email = decoded.email;

      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
        user.therapistId = therapistId;
        user.appointmentDate = appointmentDate;
        user.appointmentTime = appointmentTime;
        user.status = "pending";

        try {
          const updatedUser = await user.save();
          res.json({
            message: "Appointment booked successfully",
            user: updatedUser,
          });
        } catch (saveError) {
          console.error("Error saving appointment:", saveError);
          res.status(500).json({
            message: "Error saving appointment",
            error: saveError.message,
          });
        }
      } catch (e) {
        console.error("Error creating appointment:", e);
        res.json({ message: "Error booking appointment", error: e });
      }
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Token verification error", error: error });
  }
});



app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
