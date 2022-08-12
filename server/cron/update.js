const Similarity = require('../utils/similarity')
const AddedTrack = require('../utils/addedTrack')
const mongoose = require('mongoose')

const update = async () => {
  await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Database connected...')
  }).catch(err => {
    console.log('Database not connected ' + err)
  })
  await Similarity.updateSimilarityScores()
  await AddedTrack.removeExpiredTracks()
}

update()
