const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketplaceSchema = new Schema({
    nft: {
        type: Schema.Types.ObjectId,
        ref: "Collection",
        required: true,
        unique: true
    },
    isListed: {
        type: Boolean,
        default: false,
        required: true
    },
    listedPrice: {
        type: Number,
        min: 0
    },
    transactions: [{
        buyer: { 
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        price: {
            type: Number,
            min: 0,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Marketplace', marketplaceSchema);