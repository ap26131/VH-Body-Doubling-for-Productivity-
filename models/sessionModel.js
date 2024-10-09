const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

// Current schema for user data (need to implement field for eyetrack position data)
const sessionSchema = new mongoose.Schema({
    sid : String,
    prediction : [String],
    user : {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Session', SessionSchema);