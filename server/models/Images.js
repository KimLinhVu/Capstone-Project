const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  userId: String,
  base64: String
})

module.exports = mongoose.model('profile pictures', imageSchema)
