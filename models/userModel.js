const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Current schema for user data (need to implement field for eyetrack position data)
const userSchema = new mongoose.Schema({
    _id : {
        type: 'UUID',
        default: () => randomUUID()
    },
    firstname : String,
    lastname : String,
    email : String,
    password: String,
    age : Number,
    gender : String,
    disability : String,
    glasses : String,
    medicated : String,
    postsurvey: {
        helpOrDistract: String,
        focusImpact: String,
        naturalSpeaking: String,
        retainInfo: String,
        encourageEffect: String,
        interactEasy: String,
        recommendVH: String,
        userComments: String
    },
    presurvey: {
        focusLevel: String,
        productivityLevel: String,
        focusEase: String,
        taskDuration: String,
        concentrationDuration: String,
        focusRoutines: String,
        toolInterest: String
    }
});

module.exports = mongoose.model('User', userSchema);