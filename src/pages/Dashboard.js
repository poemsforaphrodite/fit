import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { Configuration, OpenAIApi } = require("openai");
import { animated, useSpring } from "react-spring";
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [exercisesGenerated, setExercisesGenerated] = useState(false);

  // Function to parse query parameters
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name);
  };
  const formAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  });
  useEffect(() => {
    const fetchExercises = async () => {
        try {
            const response = await fetch(`https://fit-api.vercel.app/get-exercises/${userId}`);
            const data = await response.json();

            if (data && data.exercises) {
                setCurrentExercises(data.exercises);
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    if (userId) { // Only fetch exercises if userId is set
        fetchExercises();
    }
}, [userId]); // Run this effect whenever userId changes
  useEffect(() => {
    const fetchData = async () => {
      console.log("useEffect triggered");
      const fetchedToken = getQueryParam("token");
      const fetchedUserId = getQueryParam("userId");
      console.log("Token from query param:", fetchedToken);
      console.log("UserId from query param:", fetchedUserId);

      if (
        !fetchedToken ||
        fetchedToken === "null" ||
        !fetchedUserId ||
        fetchedUserId === "null"
      ) {
        navigate("/Login");
      } else {
        // Only set states if token and userId are not null
        setToken(fetchedToken);
        setUserId(fetchedUserId);
      }
    };

    fetchData();
  }, [location, navigate]); // No need to watch token and userId

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

    fetch(`https://fit-api.vercel.app/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetch(`https://fit-api.vercel.app/generate-workout-plan/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            setWorkoutPlan(data.workoutPlan);
            setExercisesGenerated(true);
          })
          .catch((error) => {
            console.error("Error generating workout plan:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function parseWorkoutPlan(workoutPlan) {
    const days = workoutPlan.split("\n\n");

    const exercises = days.map((day) => {
      const [dayName, ...exerciseLines] = day.split("\n");
      const exercises = exerciseLines.map((line) => line.substring(3)); // remove "1. " prefix
      return {
        day: dayName,
        exercises,
      };
    });

    return exercises;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#FF9B9B", // Same color as Navbar
        padding: "20px",
      }}
    >
      <animated.form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
        style={{
          ...formAnimation,
          display: "flex",
          flexDirection: "column",
          width: "80%",
          gap: "20px",
          backgroundColor: "#FFFEC4",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
          fontSize: "1.2rem", // Increased font size
          marginTop: "100px",
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
            padding: "20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#0093f7",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.2rem", // Increased font size
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", // Add shadow effect
            transition: "all 0.3s ease", // Add smooth transition
          }}
        >
          Submit
        </button>

        {workoutPlan && (
          <div
            style={{
              marginTop: "20px",
              color: "#333",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 style={{ color: "#0093f7" }}>Generated Workout Plan</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>{workoutPlan}</pre>
          </div>
        )}

        {currentExercises.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              color: "#333",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 style={{ color: "#0093f7" }}>Current Exercises</h2>
            {currentExercises.map((exercise, index) => (
              <p key={index}>
                <strong>Day {exercise.day}:</strong> {exercise.exercise}
              </p>
            ))}
          </div>
        )}
      </animated.form>
    </div>
  );
};
export default Dashboard;
