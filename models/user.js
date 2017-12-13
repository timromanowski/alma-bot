const mongoose = require('mongoose');
const Pregnancy = require('../models/pregnancy'); 

const userSchema = new mongoose.Schema({
    user_address: {
        id: String,
        channelId: String,
        user: { id: String, name: String },
        conversation: { id: String },
        bot: { id: String, name: String },
        serviceUrl: String
    },
    name: { type: String },
    preferred_locale: String,
    zip_code: String,
    education_level: String,
    age: Number,
    has_heath_ins: Boolean,
    health_ins_provider: String,
    accecepted_terms: Date,
    current_due_date: Date,
    profile_complete: Boolean,
    pregnancies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pregnancy' }]
}, { timestamps: true });

userSchema.methods.daysLeft = function () {
    var date
    return this.model('Animal').find({ type: this.type }, cb);
}

module.exports = mongoose.model('User', userSchema);