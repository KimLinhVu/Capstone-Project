const schedule = require('node-schedule')
const Similarity = require('./similarity')
const TrackReceipt = require('../models/TrackReceipt')

/* job that updates all similarity scores in database every 5th minute */
schedule.scheduleJob('*/5 * * * *', async () => {
  await Similarity.updateSimilarityScores()
})

/* job that removes expired track receipts at the start of every hour */
schedule.scheduleJob('0 * * * *', async () => {
  const receipts = await TrackReceipt.find()

  /* delete expired receipts */
  const promises = receipts.map(async (receipt) => {
    const receiptDate = new Date(receipt.addedAt)
    const receiptSeconds = receiptDate.getTime() / 1000
    const timeNow = Date.now() / 1000

    /* delete if longer than 7 days */
    if ((timeNow - receiptSeconds) > 604800) {
      await TrackReceipt.findOneAndRemove({ _id: receipt._id })
    }
  })
  await Promise.all(promises)
})
