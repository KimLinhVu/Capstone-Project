const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const AddedTrack = require('../models/addedTrack')
const Users = require('../models/Users')

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
    addedTracks ? res.status(200).json(filteredTracks) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
