const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  spotifyId: String,
  playlistId: String,
  playlist: Object,
  added: Boolean,
  trackVector: Object
})

module.exports = mongoose.model('playlist', playlistSchema)
