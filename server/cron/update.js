const Similarity = require('../utils/similarity')
const AddedTrack = require('../utils/addedTrack')
const mongoose = require('mongoose')

const update = async () => {
  mongoose.connect(process.env.MONGO_URI)
  await Similarity.updateSimilarityScores()
  await AddedTrack.removeExpiredTracks()
}

update()
