const mongoose = require('mongoose')

const playlistSimilaritySchema = new mongoose.Schema({
  firstPlaylistId: String,
  firstPlaylistVector: Object,
  secondPlaylistId: String,
  secondPlaylistVector: Object,
  cosineSimilarityScore: Number,
  ownSimilarityScore: Number
})

module.exports = mongoose.model('playlist similarities', playlistSimilaritySchema)
