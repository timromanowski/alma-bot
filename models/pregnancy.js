const mongoose = require('mongoose');

const pregnancySchema = new mongoose.Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conception_date: Date,
    due_date: Date,
    sex: String,
    complications: [String]
});