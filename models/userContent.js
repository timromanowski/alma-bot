const mongoose = require('mongoose');

const userContentSchema = new mongoose.Schema({
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    _content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    sent_date: Date
}, { timestamps: true });

module.exports = mongoose.model('UserContent', userContentSchema);