const mongoose = require('mongoose')

const spotifyTrackSchema = new mongoose.Schema({
  trackId: String,
  trackUri: String
})

module.exports = mongoose.model('spotify tracks', spotifyTrackSchema)
