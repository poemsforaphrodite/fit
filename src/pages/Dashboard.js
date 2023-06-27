import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';

const Dashboard = () => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [fitnessGoals, setFitnessGoals] = useState('');
    const Location = useLocation();
    const handleOnSubmit = (e) => {
        e.preventDefault();
    
        const user = { 
            email: Location.state.id, 
            age, 
            height, 
            weight, 
            fitnessGoals 
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
    };
    

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
                <h1>Hello, {Location.state.id}</h1>
                <form onSubmit={handleOnSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
                    <input type="number" placeholder="Age"
                    value={age} onChange={(e) => setAge(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input type="number" placeholder="Height"
                    value={height} onChange={(e) => setHeight(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input type="number" placeholder="Weight"
                    value={weight} onChange={(e) => setWeight(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Fitness Goals"
                    value={fitnessGoals} onChange={(e) => setFitnessGoals(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <button onClick={() => alert("thanks")} type="submit" style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>Submit</button>
                </form>
            </div>
        </>
    );
    
};

export default Dashboard;