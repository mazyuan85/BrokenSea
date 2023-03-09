const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    balance: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wallets: {
        type: [walletSchema],
        default: [],
    } 
});

const User = mongoose.model('User', userSchema);
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = {
    User,
    Wallet
}