const mongoose = require('mongoose')

const addedTrackSchema = new mongoose.Schema({
  userId: String,
  otherUserId: String,
  ownUsername: String,
  username: String,
  similarityScore: Number,
  track: Object,
  playlist: Object,
  addedAt: Date
})

module.exports = mongoose.model('added tracks', addedTrackSchema)
