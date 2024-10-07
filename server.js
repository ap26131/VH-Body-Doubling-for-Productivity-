
const dotenv = require('dotenv').config()
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public'))); 

// Function for connecting to database
async function connect(){
    try{
       await mongoose.connect(process.env.MONGO_URI);
        console.log('Successful connection...');
    } catch (err){
        console.log(err);
    }
}

// Call function for connecting to database
connect();

// Start session for client
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true
    })
);

const userRoutes = require('./routes/userRoutes');
 
app.use('/', userRoutes);

// Get call for calibration page
app.get('/calibration', async (req, res) =>{

    // Check if form was submitted else redirect to form
    if(req.session.formSubmitted == true){
        res.sendFile(path.join(__dirname, 'public', 'calibration.html'));
    } else {
        res.redirect('/');
    }
});

// Get call for virtual human page
app.get('/vh', async (req, res) =>{

    // Check if form was submitted else redirect to form
    if(req.session.formSubmitted == true){
        res.sendFile(path.join(__dirname, 'public', 'virtualhuman.html'));
    } else {
        res.redirect('/');
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});