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
  }
});

const User = mongoose.model("User", newSchema);

module.exports = User;
