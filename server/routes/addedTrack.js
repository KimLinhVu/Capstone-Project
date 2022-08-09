const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const AddedTrack = require('../models/addedTrack')

const SEVEN_DAYS = 604800

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  /* adds track addedTrack to db */
  try {
    const userId = req.userId
    const { otherUserId, track, username, similarityScore, playlist, addedAt } = req.body

    const addedTrack = new AddedTrack({ userId, otherUserId, track, username, similarityScore, playlist, addedAt })
    await addedTrack.save()
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  /* returns all track addedTracks belonging to current user */
  try {
    const userId = req.userId
    const addedTracks = await AddedTrack.find({ userId })

    /* delete expired addedTracks */
    const promises = addedTracks.map(async (addedTrack) => {
      const addedTrackDate = new Date(addedTrack.addedAt)
      const addedTrackSeconds = addedTrackDate.getTime() / 1000
      const timeNow = Date.now() / 1000

      /* delete if longer than 7 days */
      if ((timeNow - addedTrackSeconds) > SEVEN_DAYS) {
        await AddedTrack.findOneAndRemove({ _id: addedTrack._id })
      }
    })
    await Promise.all(promises)
    const newaddedTracks = await AddedTrack.find({ userId })
    newaddedTracks ? res.status(200).json(newaddedTracks) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
