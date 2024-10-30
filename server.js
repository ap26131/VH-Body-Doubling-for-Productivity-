
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
    if(req.session.logged_in) {
        res.redirect("/home")
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
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

                // Redirect user to home page and emit a successful login message
                res.redirect("/home");
                io.on('connection', (socket) => {
                    console.log("Connected success");
                    socket.emit('home', "Successfully logged in!");
                });
                //Save login date
                req.session.loginDate = new Date();
            } else {
            console.log("Password does not match");
            // Redirect back to home page and show error message for incorrect password
            res.redirect("/");
            io.on('connection', (socket) => {
                console.log("Connected failure");
                socket.emit('login', "Incorrect password");
              });
           }
         })
        } else {
            console.log("Email is not registered");
            // Redirect back to home page and show error message for unregistered email
            res.redirect("/");
            io.on('connection', (socket) => {
                socket.emit('login', "Email is not registered");
              });
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
        var result = "";
        if(user === null){
          const newUser = new userModel({
            firstname : req.body.fname,
            lastname : req.body.lname,
            email : req.body.email,
            password : await bcrypt.hash(req.body.password, 8),
            age : req.body.age,
            gender : req.body.gender,
            disability : req.body.disabilityOption,
            glasses : req.body.glassesOption,
            medicated : req.body.medicatedOption
           });
           await newUser.save();
           result = "Registered successfully.";
        } else {
           result = "Email is already registered.";
        }
        res.redirect("/register");
        io.on('connection', (socket) => {
            console.log("Connected");
          socket.emit('email', result);
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
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
        req.session.quizStart = new Date();
        res.sendFile(path.join(__dirname, 'public', 'Try1.html'));
    } else {
        res.redirect('/');
    }
});

//server side quiz submission
app.post('/submit-quiz', (req, res) => {
    req.session.quizEnd = new Date();
    const answers = req.body;
    // Process the quiz answers and calculate the score
    let score = 0;
    for (const [key, value] of Object.entries(req.body)) {
        if(value === 'correct') score++;
    }
    
    req.session.quizScore = score;

    res.json({ score });
});

app.post('/send-gaze-data', (req, res) => {
    req.session.gazePoints = req.body.data;
  
    // Send a response back to the client
    res.status(200).send('Gaze points recieved');
});

app.get('/log-out', async (req, res) => {
    session.logoutDate = new Date();

    const sessionUser = userModel.findOne({email : req.session.email});

    const sessionData = new sessionModel({
        sid : req.session.id,
        user : sessionUser,
        prediction : req.session.gazePoints,
        quizScore : req.session.quizScore,
        loginDate : req.session.loginDate,
        logoutDate : req.session.logoutDate,
        quizStart : req.session.quizStart,
        quizEnd : req.session.quizEnd
      });
      await sessionData.save();
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to clear session:', err);
            return res.status(500).send('Failed to clear session');
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/'); // Redirect to root after session is cleared
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


