const mongoose = require('mongoose')

const SimilarityCountSchema = new mongoose.Schema({
  similarityMethod: String,
  count: Number
})

module.exports = mongoose.model('similarity count', SimilarityCountSchema)
