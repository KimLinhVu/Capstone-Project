const Similarity = require('../utils/similarity')
const AddedTrack = require('../utils/addedTrack')

const update = async () => {
  await Similarity.updateSimilarityScores()
  await AddedTrack.removeExpiredTracks()
}

update()
