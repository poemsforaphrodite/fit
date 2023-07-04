const express = require('express');
const { User, Appointment } = require('./mongo'); // Updated import
const mongoose = require('mongoose');

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get("/",cors(), (req, res) => {
    res.send("Hello World");
})

app.post("/login", cors(), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                res.json("Logged in successfully");
            } else {
                res.json("Incorrect password");
            }
        } else {
            res.json("Email does not exist");
        }
    } catch (e) {
        res.json(e);
    }
});


app.post("/signup",cors(), async (req, res) => {
    const{email,password} = req.body;
    const data={
        email:email,
        password:password
    }
    try{
        const check = await User.findOne({email:email});
        if(check){
            res.json("exist")
        }else{
            await User.insertMany([data]);
            res.json("not exist")
        }
    }
    catch(e){
        res.json(e);
    }
})

app.post("/update", cors(), async (req, res) => {
    const { email, age, weight, height, fitnessGoals } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            user.age = age;
            user.weight = weight;
            user.height = height;
            user.fitnessGoals = fitnessGoals;
            await user.save();
            res.json("User updated successfully");
        } else {
            res.json("User not found");
        }
    } catch (e) {
        res.json(e);
    }
});
app.post("/BookAppointment", cors(), async (req, res) => {
    console.log('Request body:', req.body); // This will log the request body

    const { userId, therapistId, appointmentDate, appointmentTime } = req.body;
    try {
        const newAppointment = new Appointment({
            userId, 
            therapistId,// Convert to ObjectId
            appointmentDate,
            appointmentTime
        });
        try {
            const savedAppointment = await newAppointment.save();
            res.json({ message: 'Appointment booked successfully', appointment: savedAppointment });
        } catch (saveError) {
            console.error('Error saving appointment:', saveError);
            res.status(500).json({ message: 'Error saving appointment', error: saveError.message });
        }          
    } catch (e) {
        console.error('Error creating appointment:', e);
        res.json({ message: 'Error booking appointment', error: e });
    }
});



app.listen(8000, () => {
    console.log("Server is running on port 8000");
})
