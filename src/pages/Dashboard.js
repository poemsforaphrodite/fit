import React, { useState } from 'react';

const Dashboard = () => {
    const [form, setForm] = useState({
        age: '',
        height: '',
        weight: '',
        fitnessGoals: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="font-sans bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96 space-y-6">
                <div className="text-center py-1 bg-gray-700 rounded">
                    <h1 className="text-lg">Dashboard Page</h1>
                </div>
                <div>
                    <label className="block text-sm">
                        Age:
                    </label>
                    <input type="number" name="age" value={form.age} onChange={handleChange} className="w-full py-1 px-2 rounded border-none bg-gray-800" />
                </div>
                <div>
                    <label className="block text-sm">
                        Height:
                    </label>
                    <input type="number" name="height" value={form.height} onChange={handleChange} className="w-full py-1 px-2 rounded border-none bg-gray-800" />
                </div>
                <div>
                    <label className="block text-sm">
                        Weight:
                    </label>
                    <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full py-1 px-2 rounded border-none bg-gray-800" />
                </div>
                <div>
                    <label className="block text-sm">
                        Fitness Goals:
                    </label>
                    <textarea name="fitnessGoals" value={form.fitnessGoals} onChange={handleChange} className="w-full py-1 px-2 rounded border-none bg-gray-800" />
                </div>
                <button type="submit" className="w-full py-1 text-sm text-white bg-blue-600 rounded cursor-pointer">Submit</button>
            </form>
        </div>
    );
};

export default Dashboard;
