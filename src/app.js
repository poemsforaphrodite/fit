const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const User = require("./mongo"); // Updated import
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {
  res.send("Hello Wossrldsssssss");
});

app.post("/login", cors(), async (req, res) => {
  const { email, password } = req.body;
  const generateUrl = (token, userId) => {
    let url = "http://localhost:3000/bookappointment";
    if (token) {
      url += `?token=${token}`;
    }
    if (userId) {
      url += token ? `&userId=${userId}` : `?userId=${userId}`;
    }
    console.log(url);
    return url;
  };
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: "3h", // Optional: set an expiration time for the token
        });

        // Log the generated token
        console.log(`Token generated successfully: ${token}`);

        // Generate the URL for the BookAppointment component
        const url = generateUrl(token, user._id);
        // Store the token value using your preferred method (e.g., localStorage, cookies, etc.)
          //TODO:implement local storage
          // localStorage.setItem("token", token);

        // // Store the URL in local storage
        // localStorage.setItem("bookAppointmentUrl", url);

        // // Redirect the user to the BookAppointment component using the received URL
        // history.push(url);

        res.status(200).json({
          message: "Logged in successfully",
          token: token,
          url: url, // Return the generated URL
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
  const {
    email,
    sex,
    age,
    height,
    weight,
    fitnessGoals,
    bodyFat,
    desiredBodyFat,
  } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.sex = sex;
      user.age = age;
      user.height = height;
      user.weight = weight;
      user.fitnessGoals = fitnessGoals;
      user.bodyFat = bodyFat;
      user.desiredBodyFat = desiredBodyFat;
      await user.save();
      res.json("User updated successfully");
    } else {
      res.json("User not found");
    }
  } catch (e) {
    res.json(e);
  }
});
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userEmail = decoded.email;
    next();
  });
};

app.post("/BookAppointment", cors(), verifyToken, async (req, res) => {
  console.log("Request body:", req.body);
  const { userId, therapistId, appointmentDate, appointmentTime } = req.body;

  try {
    const user = await User.findById(userId); // Find user using userId
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.therapistId = therapistId;
    user.appointmentDate = appointmentDate;
    user.appointmentTime = appointmentTime;
    user.status = "pending";
    await user.save();

    res.status(200).json({ message: "Appointment booked successfully" });
  } catch (e) {
    console.error(e.message);
    console.error(e.stack);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/workout-plan/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate a workout plan based on the user's data
    const workoutPlan = generateWorkoutPlan(user);

    res.send(workoutPlan);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

function generateWorkoutPlan(user) {
  // This is where you would generate a workout plan based on the user's data.
  // For now, this function just returns a placeholder workout plan.
  return {
    Monday: "Run 5km",
    Tuesday: "Bike 10km",
    Wednesday: "Rest",
    Thursday: "Swim 1km",
    Friday: "Lift weights",
    Saturday: "Yoga",
    Sunday: "Rest",
  };
}

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
