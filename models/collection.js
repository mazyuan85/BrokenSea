const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    attributes: {
        type: Map,
        of: String
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  })

  const collectionSchema = new Schema({
    name: {
        type: String,
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
    nfts: [nftSchema]
  })

  module.exports = mongoose.model('Collection', collectionSchema);