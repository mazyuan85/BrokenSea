const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    balance: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    }
}, {
    timestamps: true
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        maxlength: 50,
        required: true
    },
    wallets: {
        type: [walletSchema],
        default: [],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
