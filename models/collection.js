const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: true
    },
    imageUrl: {
        type: String,
        maxlength: 500,
        required: true
    },
    attributes: {
        type: String,
        maxlength: 100,
        required: true
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  }, {
    timestamps: true
  });

  const collectionSchema = new Schema({
    name: {
        type: String,
        maxlength: 100,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        maxlength: 500,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: true
    },
    nfts: [nftSchema]
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Collection', collectionSchema);