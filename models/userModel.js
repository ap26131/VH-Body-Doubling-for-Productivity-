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
    age : Number,
    gender : String,
    disability : String,
    glasses : String,
    medicated : String
});

module.exports = mongoose.model('User', userSchema);