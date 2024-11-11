
// Imports for server
const dotenv = require('dotenv').config()
const express = require('express');
const session = require("./middleware/session");
const path = require('path');
const { createServer } = require('http');
const PORT = process.env.PORT;
const mongoose = require('mongoose');

// Start up express application and server
const app = express();
const server = createServer(app);
const io = require('socket.io')(server);
const bcrypt = require("bcryptjs")

// Import models 
const userModel = require('./models/userModel');
const sessionModel = require('./models/sessionModel');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

// Function for connecting to database
async function connect(){
    try{
       await mongoose.connect(process.env.MONGO_URI, {
       ssl: true // Ensure SSL is enforced
       });
        console.log('Successful connection...');
    } catch (err){
        console.log(err);
    }
}

// Connect to database
connect();

// Start session for client
app.use(session);

// Route for the login page
app.get('/', async (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for validating login from user
app.post('/validate', async (req, res) => {
    try {
        const user = await userModel.findOne({email : req.body.email})
       if(user != null) {
        console.log("User found");
         bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                res.status(400).json({ error: err.message });
            }
   
            if (result) {
                console.log("Password matches");
                // Track login session with user and store email for later use
                req.session.logged_in = true;
                req.session.email = req.body.email;
                req.session.id;
                req.session.save();

                // Redirect user to home page and emit a successful login message
                return res.redirect(301,"/home");
                
            } else {
            console.log("Password does not match");
            // Redirect back to home page and show error message for incorrect password
            return res.status(401).json({message : "Incorrect password"});
           }
         })
        } else {
            console.log("Email was not found");
           return res.status(401).json({message : "Email was not found"});
         }
        } catch (err) {
         res.status(400).json({ error: err.message });
        } 
});

// Get route for registration page
app.get('/register', async (req, res) =>{
    if(req.session.logged_in) {
        res.redirect("/home");
    } else {
        res.sendFile(path.join(__dirname, 'public', 'registration.html'));
    }
});


// Post route for validating registration
app.post('/register',  async (req, res) => {
    try {
        const user = await userModel.findOne({email : req.body.email});
        if(user === null){
          const newUser = new userModel({
            firstname : req.body.fname,
            lastname : req.body.lname,
            email : req.body.email,
            password : await bcrypt.hash(req.body.password, 8),
            age : req.body.age,
            gender : req.body.gender,
            disability : req.body.disability,
            glasses : req.body.glasses,
            medicated : req.body.medicated
           });
           await newUser.save();
           return res.status(200).json({message : "Successfully registered!"});
        }
        return res.status(401).json({message : "Email already exist!"});
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
});

// Route for home page
app.get('/home', async (req, res) => {
    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'home.html'))
    } else {
        res.redirect("/");
    }
});

// Route for pre-survey page
app.get('/pre-survey', async (req, res) =>{

    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'pre-quiz-survey.html'));
    } else {
        res.redirect("/");
    }
});


app.post('/pre-survey', async (req, res) =>{
    try{
        const user = await userModel.findOneAndUpdate(
            { email: req.session.email },
            {
              $set: { presurvey: req.body },
            },
            { strict: false }
          );
        if(user !== null){
            res.redirect("/quiz");
            console.log("User has been updated");
        } else{
            console.log("User does not exist");
        }
    } catch (error) {
        console.log("error");
    }
});

// Route for post-survey page
app.get('/post-survey', async (req, res) =>{

    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'post-quiz-survey.html'));
    } else {
        res.redirect("/");
    }
});


app.post('/post-survey', async (req, res) =>{
    try{
        const user = await userModel.findOneAndUpdate(
            { email: req.session.email },
            {
              $set: { postsurvey: req.body },
            },
            { strict: false }
          );
        if(user !== null){
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to clear session' });
                }
                res.clearCookie('connect.sid'); //Clear session cookie
                res.redirect("/");
            });
            console.log("Test has ended");
        } else{
            console.log("User does not exist");
        }
    } catch (error) {
        console.log("error");
    }
});

// Route for calibration page
app.get('/calibration', async (req, res) =>{

    if(req.session.logged_in) {
        res.sendFile(path.join(__dirname, 'public', 'calibration.html'));
    } else {
        res.redirect("/");
    }
});

// Routes for virtual human page
app.get('/quiz', async (req, res) =>{
    // Check if form was submitted else redirect to form
    if(req.session.logged_in) {
        console.log(req.session.group);
        if(req.session.group != null){
            req.session.quizStart = new Date();
            if( req.session.group == "A"){
                res.sendFile(path.join(__dirname, 'public', 'GroupA.html'));
            } else if ( req.session.group == "B"){
                res.sendFile(path.join(__dirname, 'public', 'GroupB.html'));
            } else if ( req.session.group == "C"){
                res.sendFile(path.join(__dirname, 'public', 'GroupC.html'));
            } else if ( req.session.groupLetter == "D"){
                res.sendFile(path.join(__dirname, 'public', 'GroupD.html'));
            } else if ( req.session.group == "E"){
                res.sendFile(path.join(__dirname, 'public', 'GroupE.html'));
            }
        } else {
            console.log("Letter undefined");
            res.redirect('/home');
        }
    } else {
        console.log("Must be logged in");
        res.redirect('/');
    }
});

//server side quiz submission
app.post('/submit-quiz', async (req, res) => {
    req.session.quizEnd = new Date();

    // Process the quiz answers and calculate the score
    let score = 0;
    for (const [key, value] of Object.entries(req.body.quiz)) {
        if(value === 'correct') score++;
    }

    const sessionUser = userModel.findOne({email : req.session.email});

    const sessionData = new sessionModel({
        sid : req.session.id,
        user : sessionUser.UUID,
        prediction : JSON.stringify(req.body.predictions),
        quizScore : score,
        quizType : req.session.group,
        quizStart : req.session.quizStart,
        quizEnd : req.session.quizEnd,
        offscreen : req.session.offScreenCount
      });
      await sessionData.save();

    return res.status(200).json({ finalScore : score });
});

app.post('/off-screen-counter', async (req, res) => {
    if (typeof req.session.offScreenCount === 'undefined') {
        req.session.offScreenCount = 0;
    }

    req.session.offScreenCount += 1;
    res.status(200).send('Off screen count increased');
    console.log("Logged offscreen!");
    req.session.save();
});

// Route to clear session variables and redirect to the login page
app.post('/clear-session', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to clear session' });
        }
        res.clearCookie('connect.sid'); //Clear session cookie
        return res.redirect(301,"/home");
    });
});

app.post("/store-group-letter", (req, res) => {
    var group = req.body.group;
    req.session.group = group;
    console.log("Group " + req.session.group + ": Quiz 1");
    req.session.save();
    return res.redirect(301,"/pre-survey");
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});