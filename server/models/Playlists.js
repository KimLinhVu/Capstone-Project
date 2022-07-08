const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  playlistId: String,
  playlist: Object,
  added: Boolean
})

module.exports = mongoose.model('playlist', playlistSchema)
