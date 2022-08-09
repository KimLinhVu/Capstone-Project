const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  userId: String,
  pfpBase64: String,
  backgroundBase64: String
})

module.exports = mongoose.model('profile pictures', imageSchema)
