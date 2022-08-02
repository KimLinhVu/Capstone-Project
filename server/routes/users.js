const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Users = require('../models/Users')
const Playlist = require('../models/Playlists')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* gets all users except self */
    const userId = req.userId
    const { followers } = req.body
    const allUsers = await Users.find({ _id: { $ne: userId } })

    /* filters out users who are private and are not following current user */
    const filteredUsers = allUsers.filter(user => {
      /* check to see if user is private and if user is a follower */
      if (user.privacy === true) {
        if (user.showFollowing === true) {
          const found = followers?.some(obj => obj.userId === user.id)
          if (found) {
            return true
          }
        }
        return false
      }
      return true
    })
    res.json(filteredUsers)
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

router.get('/follow-profile-id', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.headers['user-id']
    const user = await Users.findOne({ _id: userId })
    !(user.privacy && !user.showFollowing) ? res.json(user) : res.json(null)
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

router.post('/add-follower-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist } = req.body
    await Users.findOneAndUpdate({ _id: userId }, {
      $push: {
        followFavorites: { playlist }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/remove-follower-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist } = req.body
    await Users.findOneAndUpdate({ _id: userId }, {
      $pull: {
        followFavorites: { playlist }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/find-follower-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist } = req.body
    const found = await Users.findOne({ _id: userId, followFavorites: { $elemMatch: { playlist } } })
    if (found) {
      res.status(200).json(true)
    } else {
      res.status(200).json(false)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/get-follower-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const result = await Users.findOne({ _id: userId })
    console.log(result)
    res.status(200).json(result.followFavorites)
  } catch (error) {
    next(error)
  }
})

module.exports = router
