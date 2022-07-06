const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  playlist: [Object]
})

module.exports = mongoose.model('playlist', playlistSchema)
