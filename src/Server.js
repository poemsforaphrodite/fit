// To connect with your mongoDB database
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pushpendersolanki895:Sspdpsks@895@cluster0.blspoof.mongodb.net/?retryWrites=true&w=majority', {
	dbName: 'Cluster0',
	useNewUrlParser: true,
	useUnifiedTopology: true
}, err => err ? console.log(err) :
	console.log('Connected to yourDB-name database'));

// Schema for users of app
const UserSchema = new mongoose.Schema({
    age: Number,
    height: Number,
    weight: Number,
    fitnessGoals: String,
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
const User = mongoose.model('users', UserSchema);
User.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 3000");
app.use(express.json());
app.use(cors());
app.get("/Dashboard", (req, resp) => {

	resp.send("App is Working");
	// You can check backend is working or not by
	// entering http://loacalhost:5000
	
	// If you see App is working means
	// backend working properly
});

app.post("/Dashboard", async (req, resp) => {
	try {
		const user = new User(req.body);
		let result = await user.save();
		result = result.toObject();
		if (result) {
			delete result.password;
			resp.send(req.body);
			console.log(result);
		} else {
			console.log("User already register");
		}

	} catch (e) {
		resp.send("Something Went Wrong");
	}
});
app.listen(3000);
