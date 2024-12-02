const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Schema for user data
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
    disorder : String,
});

module.exports = mongoose.model('User', userSchema);