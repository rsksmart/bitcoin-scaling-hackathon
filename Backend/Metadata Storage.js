// app/models/NFT.js

const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Other metadata fields
});

module.exports = mongoose.model('NFT', NFTSchema);
