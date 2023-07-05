const express = require("express");
require("dotenv").config();
const User = require("./mongo"); // Updated import
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
    //TODO: do sommething about the process env
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        //const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
        res.status(200).json({
          message: "Logged in successfully",
          // token: token,
        });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "Email does not exist" });
    }
  } catch (e) {
    console.error(e.message);
    console.error(e.stack);
    res.status(500).json({ message: "An error occurred" });
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
    // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    //   if (!token) {
    //     console.log("Token is not provided in the request body");
    //     res.status(400).json({ message: "Token is required" });
    //     return;
    //   }
    //   if (err) {
    //     res.status(401).json({ message: "Invalid token" });
    //     console.error(err.message);
    //     console.error(err.stack);
    //     return;
    //   }

    // const email = decoded.email;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.therapistId = therapistId;
    user.appointmentDate = appointmentDate;
    user.appointmentTime = appointmentTime;
    user.status = "pending";
    // ...
  } catch (e) {
    console.error(e.message);
    console.error(e.stack);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
