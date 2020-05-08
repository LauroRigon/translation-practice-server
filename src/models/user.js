const mongoose = require('../database');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    created: {
        type: Date,
        default: Date.now,
    }
})

module.exports = {
    User: mongoose.model('User', userSchema),
}