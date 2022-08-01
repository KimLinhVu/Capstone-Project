const mongoose = require('mongoose')

const playlistSimilaritySchema = new mongoose.Schema({
  firstPlaylistId: String,
  secondPlaylistId: String,
  cosineSimilarityScore: Number,
  ownSimilarityScore: Number
})

module.exports = mongoose.model('playlist similarities', playlistSimilaritySchema)
