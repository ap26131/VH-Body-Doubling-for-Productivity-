const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Current schema for user data (need to implement field for eyetrack position data)
const sessionSchema = new mongoose.Schema({
    sid : String,
    prediction : Object,
    user : {type: mongoose.Schema.Types.UUID, ref: 'User'},
    quizScore : Number,
    quizStart : Date,
    quizEnd : Date,
    quizType : String,
    offscreen : Number
});

module.exports = mongoose.model('Session', sessionSchema);