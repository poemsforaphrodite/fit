import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const Dashboard = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [heightUnit, setUnitHeight] = useState("cm");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [desiredBodyFat, setDesiredBodyFat] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [currentExercises, setCurrentExercises] = useState([]); // Added state for current exercises
  const location = useLocation();

  // Function to parse query parameters
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name);
  };

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

  const handleOnSubmit = () => {
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
        const userModel = await User.findById(user._id);
        if (!userModel) {
          throw new Error(`User with ID ${user._id} not found`);
        }

        userModel.workoutPlan = workoutPlan;
        await userModel.save(); // Now you can call .save()
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
    const user = {
      userId, // Use userId instead of email
      sex,
      age,
      height: heightUnit === "ft" ? height * 30.48 : height,
      weight: weightUnit === "lbs" ? weight * 0.453592 : weight,
      fitnessGoals,
      bodyFat,
      desiredBodyFat,
    };

    fetch(`http://localhost:8000/dashboard`, {
      method: "POST", // or 'PUT' if you're updating an existing user
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        generateWorkoutPlanWithOpenAI(user) // Generate workout plan with OpenAI API
          .then((workoutPlan) => {
            setWorkoutPlan(workoutPlan);
            setCurrentExercises(parseWorkoutPlan(workoutPlan)); // Parse the workout plan and set current exercises
          })
          .catch((error) => {
            console.error("Error generating workout plan:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const parseWorkoutPlan = (workoutPlan) => {
    // Parse the workout plan and extract current exercises
    const exercises = [];
    const lines = workoutPlan.split("\n");
    let day = "";
    for (const line of lines) {
      if (line.includes("Day:")) {
        day = line.slice(5).trim();
      } else if (line.includes("-")) {
        const exercise = line.slice(1).trim();
        if (day && exercise) {
          exercises.push({
            day,
            exercise,
          });
        }
      }
    }
    return exercises;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#FF9B9B", // Changed the background color
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "10px",
        }}
      >
        <select
          value={fitnessGoals}
          onChange={(e) => setFitnessGoals(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <option value="">Select Main Goal</option>
          <option value="lose weight">Lose Weight</option>
          <option value="get fitter">Get Fitter</option>
          <option value="build muscle">Build Muscle</option>
        </select>

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <select
            value={heightUnit}
            onChange={(e) => setUnitHeight(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginLeft: "10px",
            }}
          >
            <option value="cm">cm</option>
            <option value="ft">ft</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginLeft: "10px",
            }}
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>

        <input
          type="number"
          placeholder="Current Body Fat"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="number"
          placeholder="Desired Body Fat"
          value={desiredBodyFat}
          onChange={(e) => setDesiredBodyFat(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            backgroundColor: "#FF9B9B",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        {workoutPlan && (
          <div
            style={{
              marginTop: "20px",
              color: "#0093f7",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <h2>Generated Workout Plan</h2>
            <pre>{workoutPlan}</pre>
          </div>
        )}

        {currentExercises.length > -1 && (
          <div
            style={{
              marginTop: "20px",
              color: "#0093f7",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <h2>Current Exercises</h2>
            {currentExercises.map((exercise, index) => (
              <p key={index}>
                <strong>Day {exercise.day}:</strong> {exercise.exercise}
              </p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
