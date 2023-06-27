const express = require('express');
const collection = require("./mongo");
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
        const user = await collection.findOne({ email: email });

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
        const check = await collection.findOne({email:email});
        if(check){
            res.json("exist")
        }else{
            await collection.insertMany([data]);
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
        const user = await collection.findOne({ email: email });
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


app.listen(8000, () => {
    console.log("Server is running on port 8000");
})
