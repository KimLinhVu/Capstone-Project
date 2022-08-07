const schedule = require('node-schedule')
const Similarity = require('./similarity')

/* job that updates all similarity scores in database every 5th minute */
schedule.scheduleJob('*/5 * * * *', async () => {
  await Similarity.updateSimilarityScores()
})
