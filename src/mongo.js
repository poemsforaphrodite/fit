const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://pushpendersolanki895:1234@cluster0.blspoof.mongodb.net/Cluster0?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

const newSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    age:{type: Number},
    weight:{type: Number},
    height:{type: Number},
    fitnessGoals:{type: String}
});
const appointmentSchema = new mongoose.Schema({
    userId: {type: Number},
    therapistId: {type: Number},
    appointmentDate: {type: Date, required: true},
    appointmentTime: {type: String, required: true},
    status: {type: String, default: 'pending'}
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

const collection = mongoose.model('collection', newSchema);


module.exports = { Appointment, collection };
