const mongoose = require('mongoose')

const SpotifyTokenSchema = new mongoose.Schema({
  userId: String,
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Number,
  timeStamp: Number
})

module.exports = mongoose.model('spotify tokens', SpotifyTokenSchema)