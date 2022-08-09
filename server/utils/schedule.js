const schedule = require('node-schedule')
const Similarity = require('./similarity')
const addedTrack = require('../models/addedTrack')

/* job that updates all similarity scores in database every 5th minute */
schedule.scheduleJob('*/5 * * * *', async () => {
  await Similarity.updateSimilarityScores()
})

/* job that removes expired track records at the start of every hour */
schedule.scheduleJob('0 * * * *', async () => {
  const tracks = await addedTrack.find()

  /* delete expired tracks */
  const promises = tracks.map(async (track) => {
    const trackDate = new Date(track.addedAt)
    const trackSeconds = trackDate.getTime() / 1000
    const timeNow = Date.now() / 1000

    /* delete if longer than 7 days */
    if ((timeNow - trackSeconds) > 604800) {
      await addedTrack.findOneAndRemove({ _id: track._id })
    }
  })
  await Promise.all(promises)
})
