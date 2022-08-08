const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  userId: String,
  otherUserId: String,
  playlistId: String,
  comment: String,
  createdAt: Date,
  likes: Number
})

module.exports = mongoose.model('comments', commentSchema)
