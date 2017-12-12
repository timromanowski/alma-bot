const mongoose = require('mongoose');

const pregnancySchema = new mongoose.Schema({
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    intake_completed_date: Date,
    intake_completed: Boolean,
    conception_date: Date,
    due_date: Date,
    sex: String,
    complications: [String],
    anxiety: Number,
    confidence: Number
}, { timestamps: true });

module.exports = mongoose.model('Pregnancy', pregnancySchema);