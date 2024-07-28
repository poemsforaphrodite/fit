const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const cors = require('cors');
const Stripe = require('stripe');

// Load .env file from one directory up
const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

// Update your OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
  console.error("OpenAI API key is not set. Please check your .env file.");
}

const openai = new OpenAIApi(configuration);

require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });

const newSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Add this line
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  fitnessGoals: { type: String },
  therapistId: { type: Number }, // Add this line
  appointmentDate: { type: Date }, // Add this line
  appointmentTime: { type: String }, // Add this line
  status: { type: String, default: "pending" },
  workoutPlan: { type: String },
  zoomMeetingId: { type: String },
  zoomMeetingJoinUrl: { type: String },
  temp: {
    meow: { type: String },
    meow2: { type: String },
  },
  currentBodyFat: { type: Number },
  desiredBodyFat: { type: Number },
});

const User = mongoose.model("User", newSchema);

const jwt = require("jsonwebtoken");
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://fit-psi.vercel.app'], // Allow both origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.send("Hello Wossrldsssssss");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const generateUrl = (token, userId, path) => {
    let url = `/${path}`;
    if (token) {
      url += `?token=${token}`;
    }
    if (userId) {
      url += token ? `&userId=${userId}` : `?userId=${userId}`;
    }
    return url;
  };
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);

        // Log the generated token
        // console.log(`Token generated successfully: ${token}`);

        // Generate the URL for the Dashboard component
        const url = generateUrl(token, user._id, "dashboard");
        console.log(
          `https://fit-psi.vercel.app/` +
            generateUrl(token, user._id, "BookAppointment")
        );
        console.log(generateUrl(token, user._id, "dashboard"));
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "dashboard",
            generateUrl(token, user._id, "dashboard")
          );
          localStorage.setItem(
            "BookAppointment",
            generateUrl(token, user._id, "BookAppointment")
          );
        }
        res.status(200).json({
          message: "Logged in successfully",
          token: token,
          url: url,
          userId: user._id, // Return the generated URL
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

app.post("/signup", async (req, res) => {
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

app.post("/dashboard/", async (req, res) => {
  const {
    userId,
    sex,
    age,
    height,
    weight,
    fitnessGoals,
    bodyFat,
    desiredBodyFat,
  } = req.body;
  try {
    const user = await User.findById(userId);
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

app.post("/BookAppointment", verifyToken, async (req, res) => {
  try {
    // Get Zoom access token
    const zoomAccessToken = await getZoomAccessToken(
      process.env.ZOOM_CLIENT_ID,
      process.env.ZOOM_CLIENT_SECRET,
      process.env.ZOOM_USER_ID
    );

    if (!zoomAccessToken) {
      throw new Error("Error getting Zoom access token");
    }

    // Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(
      process.env.ZOOM_USER_ID,
      zoomAccessToken,
      req.body.appointmentDate,
      req.body.appointmentTime
    );

    if (!zoomMeeting) {
      throw new Error("Error creating Zoom meeting");
    }

    const user = await User.findById(req.body.userId);
    user.therapistId = req.body.therapistId;
    user.appointmentDate = req.body.appointmentDate;
    user.appointmentTime = req.body.appointmentTime;
    user.zoomMeetingId = zoomMeeting.id; // Save Zoom meeting ID
    user.zoomMeetingJoinUrl = zoomMeeting.join_url; // Save Zoom meeting join URL
    user.status = "pending";
    await user.save();

    return {
      message: "Appointment booked successfully",
      zoomMeeting: zoomMeeting, // Return the Zoom meeting details
    };
  } catch (e) {
    console.error(e.message);
    console.error(e.stack);
    throw e;
  }
});

async function getZoomAccessToken(clientId, clientSecret, accountId) {
  const zoomApiUrl = "https://zoom.us/oauth/token";
  const zoomApiAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const params = new URLSearchParams();
  params.append("grant_type", "account_credentials");
  params.append("account_id", accountId);

  try {
    const response = await axios.post(zoomApiUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${zoomApiAuth}`,
      },
    });
    console.log("Access token:", response.data.access_token);
    console.log("Response data:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Zoom access token:", error);
    console.error("Request:", error.request);
    console.error("Response:", error.response);
    return null;
  }
}

async function createZoomMeeting(
  userId,
  accessToken,
  appointmentDate,
  appointmentTime
) {
  const zoomApiUrl = `https://api.zoom.us/v2/users/me/meetings`;
  console.log("Creating Zoom meeting...");
  console.log("Zoom API URL:", zoomApiUrl);
  console.log("User ID:", userId);
  console.log("Appointment Date:", appointmentDate);
  console.log("Appointment Time:", appointmentTime);

  const meetingPayload = {
    agenda: "Therapy",
    default_password: false,
    duration: 60,
    password: "123456",
    start_time: `${appointmentDate}T${appointmentTime}:00`,
    template_id: "Dv4YdINdTk+Z5RToadh5ug==",
    timezone: "India/Delhi",
    topic: "Therapy",
    tracking_fields: [
      {
        field: "field1",
        value: "value1",
      },
    ],
    type: 2,
  };
  console.log("Meeting Payload:", JSON.stringify(meetingPayload, null, 2));

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  console.log("Request Headers:", JSON.stringify(headers, null, 2));

  try {
    console.log("Sending request to Zoom API...");
    const response = await axios.post(zoomApiUrl, meetingPayload, {
      headers: headers,
    });
    console.log("Zoom API Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error.message);
    if (error.response) {
      console.error("Zoom API Error Response:", error.response.data);
      console.error("Zoom API Error Status:", error.response.status);
    }
    return null;
  }
}

async function generateWorkoutPlanWithOpenAI(user) {
  console.log("Generating workout plan for user:", user._id);
  try {
    console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Set" : "Not set");
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate a daily workout plan for a user with the following information:
          - Age: ${user.age}
          - Weight: ${user.weight}
          - Height: ${user.height}
          - Fitness Goals: ${user.fitnessGoals},
          generate the workout day-wise for 7 days. and give three exercises for each day. start with monday`,
        },
      ],
    });
    console.log("OpenAI API response received");
    const workoutPlan = completion.data.choices[0].message.content;
    return workoutPlan;
  } catch (err) {
    console.error("Error generating workout plan with OpenAI API:", err);

    if (err.response) {
      console.error("OpenAI API error response:", err.response.data);
      console.error("OpenAI API error status:", err.response.status);
    } else if (err.request) {
      console.error("No response received from OpenAI API");
    } else {
      console.error("Error setting up the request:", err.message);
    }

    if (err.message.includes("invalid_api_key")) {
      throw new Error("Invalid API key. Please check your OpenAI API key configuration.");
    }

    throw new Error("Failed to generate workout plan: " + err.message);
  }
}
// On your server

async function bookAppointment(req) {
  console.log("haaaaaaaaaaaaaaaaai");
  try {
    // Get Zoom access token
    const zoomAccessToken = await getZoomAccessToken(
      process.env.ZOOM_CLIENT_ID,
      process.env.ZOOM_CLIENT_SECRET,
      process.env.ZOOM_USER_ID
    );

    if (!zoomAccessToken) {
      throw new Error("Error getting Zoom access token");
    }

    // Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(
      process.env.ZOOM_USER_ID,
      zoomAccessToken,
      req.body.appointmentDate,
      req.body.appointmentTime
    );

    if (!zoomMeeting) {
      throw new Error("Error creating Zoom meeting");
    }

    const user = await User.findById(req.body.userId);
    user.therapistId = req.body.therapistId;
    user.appointmentDate = req.body.appointmentDate;
    user.appointmentTime = req.body.appointmentTime;
    user.zoomMeetingId = zoomMeeting.id; // Save Zoom meeting ID
    user.zoomMeetingJoinUrl = zoomMeeting.join_url; // Save Zoom meeting join URL
    user.status = "pending";
    await user.save();

    return {
      message: "Appointment booked successfully",
      zoomMeeting: zoomMeeting, // Return the Zoom meeting details
    };
  } catch (e) {
    console.error(e.message);
    console.error(e.stack);
    throw e;
  }
}
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Appointment",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://fit-psi.vercel.app//",
      cancel_url: `https://fit-psi.vercel.app//bookAppointment?token=${req.body.token}&userId=${req.body.userId}`,
      metadata: {
        userId: req.body.userId,
        therapistId: req.body.therapistId,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
      },
    });

    res.json({ id: session.id });
  } catch (e) {
    console.error('Error creating checkout session:', e);
    res.status(500).json({
      message: "An error occurred while creating the checkout session",
      error: e.message,
    });
  }
});

const endpointSecret =
  "whsec_07ab00d0a2e1d2ac097d07e7cb9b9dc6f861ed96e7d970bd684325209dfd2839";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Handle successful payment
        await handleSuccessfulPayment(session);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

async function handleSuccessfulPayment(session) {
  const { userId, therapistId, appointmentDate, appointmentTime } = session.metadata;

  console.log(`Payment successful for user ${userId}. Processing appointment booking...`);

  try {
    console.log("Attempting to get Zoom access token...");
    const zoomAccessToken = await getZoomAccessToken(
      process.env.ZOOM_CLIENT_ID,
      process.env.ZOOM_CLIENT_SECRET,
      process.env.ZOOM_USER_ID
    );

    if (!zoomAccessToken) {
      console.error("Failed to obtain Zoom access token");
      throw new Error("Error getting Zoom access token");
    }
    console.log("Zoom access token obtained successfully");

    console.log("Attempting to create Zoom meeting...");
    const zoomMeeting = await createZoomMeeting(
      process.env.ZOOM_USER_ID,
      zoomAccessToken,
      appointmentDate,
      appointmentTime
    );

    if (!zoomMeeting) {
      console.error("Failed to create Zoom meeting");
      throw new Error("Error creating Zoom meeting");
    }
    console.log("Zoom meeting created successfully:", zoomMeeting.id);

    console.log(`Updating user ${userId} with appointment and Zoom meeting details...`);
    const user = await User.findById(userId);
    user.therapistId = therapistId;
    user.appointmentDate = appointmentDate;
    user.appointmentTime = appointmentTime;
    user.zoomMeetingId = zoomMeeting.id;
    user.zoomMeetingJoinUrl = zoomMeeting.join_url;
    user.status = "confirmed";
    await user.save();
    console.log(`User ${userId} updated successfully`);

    console.log("Appointment booked and Zoom meeting created successfully");
    console.log("Zoom Meeting ID:", zoomMeeting.id);
    console.log("Zoom Meeting Join URL:", zoomMeeting.join_url);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }
}

// Workout plan route
app.get("/generate-workout-plan/:userId", async (req, res) => {
  console.log("Received request to generate workout plan for user:", req.params.userId);
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      console.log("User not found:", req.params.userId);
      return res.status(404).send("User not found");
    }
    console.log("User found:", user);
    
    // If the user has a valid workout plan, return that plan
    if (user.workoutPlan && !user.workoutPlan.startsWith("Error")) {
      console.log("Returning existing workout plan for user:", req.params.userId);
      return res.json({ workoutPlan: user.workoutPlan });
    }
    
    // Generate a new workout plan
    console.log("Generating new workout plan for user:", req.params.userId);
    const workoutPlan = await generateWorkoutPlanWithOpenAI(user);
    console.log("Workout plan generated:", workoutPlan);
    
    user.workoutPlan = workoutPlan;
    await user.save();
    console.log("Workout plan saved for user:", req.params.userId);
    
    res.json({ workoutPlan: workoutPlan });
  } catch (err) {
    console.error("Error in generate-workout-plan route:", err);
    res.status(500).json({ error: "Failed to generate workout plan", message: err.message });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      workoutPlan: user.workoutPlan,
      appointmentDate: user.appointmentDate,
      appointmentTime: user.appointmentTime,
      zoomMeetingJoinUrl: user.zoomMeetingJoinUrl,
      // Include any other relevant user data
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this new route
app.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { age, weight, height, currentBodyFat, desiredBodyFat } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    user.age = age || user.age;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.currentBodyFat = currentBodyFat || user.currentBodyFat;
    user.desiredBodyFat = desiredBodyFat || user.desiredBodyFat;

    await user.save();

    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server is running on https://fit-api.vercel.app");
});
