import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
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

    //...
    fetch(`http://localhost:8000/dashboard`, {
      //...
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
          onClick={handleOnSubmit}
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

        {currentExercises.length > 0 && (
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
