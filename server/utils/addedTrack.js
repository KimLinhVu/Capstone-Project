const AddedTrack = require('../models/addedTrack')
const Users = require('../models/Users')

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

  static filterAddedTracks = async (addedTracks, userId) => {
    const filteredTracks = []

    /* filter out private users */
    const promises = addedTracks?.map(async (track) => {
      const data = await Users.findOne({ _id: track.otherUserId })
      if (data.isPrivate) {
        if (data.showFollowing === true) {
          const found = data.following?.some(obj => obj.userId === userId)
          if (found) {
            filteredTracks.push(track)
          }
        }
      } else {
        filteredTracks.push(track)
      }
    })
    await Promise.all(promises)
    return filteredTracks
  }
}

module.exports = addedTrack
