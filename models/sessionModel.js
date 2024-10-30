const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Current schema for user data (need to implement field for eyetrack position data)
const sessionSchema = new mongoose.Schema({
    sid : String,
    prediction : [String],
    user : {type: mongoose.Schema.Types.UUID, ref: 'User'},
    quizScore : Number,
    loginDate : Date,
    logOutDate : Date,
    quizStart : Date,
    quizEnd : Date
});

module.exports = mongoose.model('Session', sessionSchema);