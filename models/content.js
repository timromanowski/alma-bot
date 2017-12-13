const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({    
    name: { type: String, index: true },    
    window_days_start: Number,
    window_days_end: Number,
    local_key: String,
    tags: [String]   
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);