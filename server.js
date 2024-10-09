
// Imports for server
const dotenv = require('dotenv').config()
const express = require('express');
const session = require("./middleware/session");
const path = require('path');
const app = express();
const http = require('http')
const PORT = process.env.PORT;
const mongoose = require('mongoose');

// Controller for forms
const formController = require('./controllers/formController');

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

connect();

// Start session for client
app.use(session);

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/validate', formController.validateUser);

// Routes for register
app.get('/register', async (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

app.post('/register',  formController.createUser);

// Routes for calibration page
app.get('/calibration', async (req, res) =>{

    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'calibration.html'));
    } else {
        res.redirect("/");
    }
});

// Routes for virtual human page
app.get('/vh', async (req, res) =>{

    // Check if form was submitted else redirect to form
    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'virtualhuman.html'));
    } else {
        res.redirect('/');
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});