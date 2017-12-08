const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_address: {
        id: String,
        channelId: String,
        user: { id: String, name: String },
        conversation: { id: String },
        bot: { id: String, name: String },
        serviceUrl: String
    },
    name: { type: String, index: true },
    preferred_locale: String,
    age: Number,
    has_heath_ins: Boolean,
    health_ins_provider: String,
    pregnancies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pregnancy' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);