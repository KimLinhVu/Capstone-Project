const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const AddedTrack = require('../models/addedTrack')
const addedTrack = require('../utils/addedTrack')
const Users = require('../models/Users')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  /* adds track addedTrack to db */
  try {
    const userId = req.userId
    const { otherUserId, track, username, similarityScore, playlist, addedAt } = req.body
    const user = await Users.findOne({ _id: userId })
    const ownUsername = user.username

    const addedTrack = new AddedTrack({ userId, ownUsername, otherUserId, track, username, similarityScore, playlist, addedAt })
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
    const filteredTracks = await addedTrack.filterAddedTracks(addedTracks, userId)
    addedTracks ? res.status(200).json(filteredTracks) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

router.get('/following', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await Users.findOne({ _id: userId })
    const addedTracks = []

    const promises = user.following.map(async (user) => {
      const userAddedTracks = await AddedTrack.find({ userId: user.userId })
      const filteredTracks = await addedTrack.filterAddedTracks(userAddedTracks, userId)
      addedTracks.push(filteredTracks)
    })
    await Promise.all(promises)
    res.status(200).json(addedTracks)
  } catch (error) {
    next(error)
  }
})

module.exports = router
