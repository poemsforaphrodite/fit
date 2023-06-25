import React, { useState } from 'react';


const Dashboard = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fitnessGoals, setFitnessGoals] = useState('');

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const user = { age, height, weight, fitnessGoals };

        fetch('http://localhost:3000/Dashboard', {
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
    };

    return (
        <>
            <h1>This is React WebApp </h1>
            <form onSubmit={handleOnSubmit}>
                <input type="number" placeholder="Age"
                value={age} onChange={(e) => setAge(e.target.value)} />
                <input type="number" placeholder="Height"
                value={height} onChange={(e) => setHeight(e.target.value)} />
                <input type="number" placeholder="Weight"
                value={weight} onChange={(e) => setWeight(e.target.value)} />
                <input type="text" placeholder="Fitness Goals"
                value={fitnessGoals} onChange={(e) => setFitnessGoals(e.target.value)} />
                <button type="submit">submit</button>
            </form>
        </>
    );
};

export default Dashboard;