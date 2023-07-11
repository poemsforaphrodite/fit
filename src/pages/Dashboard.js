import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [heightUnit, setUnitHeight] = useState('cm');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [desiredBodyFat, setDesiredBodyFat] = useState('');
  const location = useLocation();

  const handleOnNext = () => {
    setStep(step + 1);
  };

  const handleOnSubmit = () => {
    const user = {
      email: location.state.id,
      sex,
      age,
      height: heightUnit === 'ft' ? height * 30.48 : height,
      weight: weightUnit === 'lbs' ? weight * 0.453592 : weight,
      fitnessGoals,
      bodyFat,
      desiredBodyFat,
    };
    fetch('http://localhost:8000/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });

    console.log(user);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f1b725', // Updated color
      }}
    >
      <h1 style={{ color: '#0093f7' }}>Hello, {location.state.id}</h1>
      <form style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        {step === 1 && (
          <>
            <select
              value={fitnessGoals}
              onChange={(e) => setFitnessGoals(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">Select Main Goal</option>
              <option value="lose weight">Lose Weight</option>
              <option value="get fitter">Get Fitter</option>
              <option value="build muscle">Build Muscle</option>
            </select>
            <button
              onClick={handleOnNext}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                backgroundColor: '#0093f7', // Updated color
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <select
                value={heightUnit}
                onChange={(e) => setUnitHeight(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginLeft: '10px' }}
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginLeft: '10px' }}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
            <button
              onClick={handleOnNext}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                backgroundColor: '#0093f7', // Updated color
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="number"
              placeholder="Current Body Fat"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <input
              type="number"
              placeholder="Desired Body Fat"
              value={desiredBodyFat}
              onChange={(e) => setDesiredBodyFat(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
            <button
              onClick={handleOnSubmit}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                backgroundColor: '#0093f7', // Updated color
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
