const mongoose = require('mongoose')

const trackReceiptSchema = new mongoose.Schema({
  userId: String,
  otherUserId: String,
  username: String,
  similarityScore: Number,
  track: Object,
  playlist: Object,
  addedAt: Date
})

module.exports = mongoose.model('track receipts', trackReceiptSchema)
