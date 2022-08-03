const mongoose = require('mongoose')

const trackFactorsSchema = new mongoose.Schema({
  acousticness: Number,
  danceability: Number,
  energy: Number,
  instrumentalness: Number,
  key: Number,
  liveness: Number,
  loudness: Number,
  mode: Number,
  speechiness: Number,
  time_signature: Number,
  valence: Number
})

module.exports = mongoose.model('track factors', trackFactorsSchema)
