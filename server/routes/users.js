const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Users = require('../models/Users')
const Playlist = require('../models/Playlists')

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* gets all users except self */
    const userId = req.userId
    const allUsers = await Users.find({ _id: { $ne: userId }, privacy: false })
    res.json(allUsers)
  } catch (error) {
    next(error)
  }
})

router.get('/profile', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await Users.findOne({ _id: userId })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/profile-id', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.headers['user-id']
    const user = await Users.findOne({ _id: userId })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/playlist', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.headers['user-id']
    const playlists = await Playlist.find({ userId, added: true })
    res.json(playlists)
  } catch (error) {
    next(error)
  }
})

router.get('/location', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await Users.findOne({ _id: userId })
    res.json(user.location)
  } catch (error) {
    next(error)
  }
})

router.post('/add-follower', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { otherUserId } = req.body
    await Users.findOneAndUpdate({ _id: otherUserId }, {
      $push: {
        followers: { userId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/add-following', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { otherUserId } = req.body

    await Users.findOneAndUpdate({ _id: userId }, {
      $push: {
        following: { userId: otherUserId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/remove-follower', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { otherUserId } = req.body

    await Users.findOneAndUpdate({ _id: otherUserId }, {
      $pull: {
        followers: { userId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/remove-following', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { otherUserId } = req.body

    await Users.findOneAndUpdate({ _id: userId }, {
      $pull: {
        following: { userId: otherUserId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
