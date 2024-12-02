const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Schema for session data
const sessionSchema = new mongoose.Schema({
    _id : {
        type: 'UUID',
        default: () => randomUUID()
    },
    sid : String,
    prediction : Object,
    user : String,
    calibration : Number,
    quizanswers : Object,
    quizScore : Number,
    quizStart : Date,
    quizEnd : Date,
    quizType : String,
    offscreen : Number,
    presurvey: Object,
    postsurvey: Object
});

module.exports = mongoose.model('Session', sessionSchema);