const mongoose = require('mongoose');

const starterSchema = new mongoose.Schema({    
    name: { type: String, index: true },
    preferred_locale: String,
    age: Number
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);