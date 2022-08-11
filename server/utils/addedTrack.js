const AddedTrack = require('../models/addedTrack')
class addedTrack {
  static removeExpiredTracks = async () => {
    const tracks = await AddedTrack.find()

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
  }
}

module.exports = addedTrack
