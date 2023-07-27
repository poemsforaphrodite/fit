const express = require("express");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const configuration = new Configuration({
  apiKey: "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",
});
const stripe = require("stripe")(
  "sk_test_51NUTGeSIumqhegZiE5mk70SY3wW3wLSROTnxXVKSOUl4psQzytfdLqFf6yrOHCHNEoVKqC7NvyttOGEmJgyNFavk00cANk5Kf2"
);

const openai = new OpenAIApi(configuration);
require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://pushpendersolanki895:1234@cluster0.blspoof.mongodb.net/Cluster0?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

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
});

const User = mongoose.model("User", newSchema);

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
          `http://localhost:3000` +
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

app.post("/dashboard/", cors(), async (req, res) => {
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

app.post("/BookAppointment", cors(), verifyToken, async (req, res) => {
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

//FIXME: booking is done before payment
async function createZoomMeeting(
  userId,
  accessToken,
  appointmentDate,
  appointmentTime
) {
  const zoomApiUrl = `https://api.zoom.us/v2/users/me/meetings`;
  console.log("zoomApiUrl:", zoomApiUrl); // Add this line
  console.log("Access token in createZoomMeeting:", accessToken);
  console.log("User ID in createZoomMeeting:", userId);

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
  console.log("meetingPayload:", meetingPayload); // Add this line

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}}`,
  };
  console.log("headers:", headers); // Add this line

  try {
    const response = await axios.post(zoomApiUrl, meetingPayload, {
      headers: headers,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    console.error("Error response:", error.response);
    return null;
  }
}

async function generateWorkoutPlanWithOpenAI(user) {
  console.log("hi");
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
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
    const workoutPlan = completion.data.choices[0].message.content;
    user.workoutPlan = workoutPlan;
    await user.save();
    console.log("Workout plan:", workoutPlan);
    return workoutPlan;
  } catch (err) {
    console.error("Error generating workout plan with OpenAI API:", err);

    // Log the error response from the OpenAI API
    console.error(
      "OpenAI API error response:",
      err.response ? err.response.data : "No error response available"
    );

    return "Error generating workout plan. Please try again later.";
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
  console.log("hi");
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
    success_url: "http://localhost:3000/",
    cancel_url: `http://localhost:3000/bookAppointment?token=${req.body.token}&userId=${req.body.userId}`,
  });

  try {
    console.log(req.body);
    const bookingResult = await bookAppointment(req);

    // Add webhook logic here
    if (bookingResult.success) {
      // Create Zoom meeting using the retrieved data
      const zoomMeeting = await createZoomMeeting(req.body);
      console.log("Zoom meeting created:", zoomMeeting);
    }

    res.json({ id: session.id, booking: bookingResult });
  } catch (e) {
    res
      .status(500)
      .json({
        message: "An error occurred while booking the appointment",
        error: e.message,
      });
  }
});

const endpointSecret =
  "whsec_07ab00d0a2e1d2ac097d07e7cb9b9dc6f861ed96e7d970bd684325209dfd2839";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
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
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// Workout plan route
app.get("/generate-workout-plan/:userId", cors(), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // If the user already has a workout plan, return that plan
    if (user.workoutPlan) {
      return res.json({ workoutPlan: user.workoutPlan });
    }
    // If the user doesn't have a workout plan, generate a new one
    const workoutPlan = await generateWorkoutPlanWithOpenAI(user);
    user.workoutPlan = workoutPlan;
    await user.save();
    res.json({ workoutPlan: workoutPlan });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
