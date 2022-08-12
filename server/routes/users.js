const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Users = require('../models/Users')
const Playlist = require('../models/Playlists')
const cache = require('../utils/cache')
const myCache = cache.myCache

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* gets all users except self */
    const userId = req.userId
    const { followers } = req.body
    let allUsers

    /* check if data has already been cached */
    if (myCache.has('allUsers')) {
      allUsers = myCache.get('allUsers')
    } else {
      allUsers = await Users.find({ _id: { $ne: userId } })
      /* set data in cache on first call */
      myCache.set('allUsers', allUsers)
    }

    /* filters out users who are private and are not following current user */
    const filteredUsers = allUsers.filter(user => {
      /* check to see if user is private and if user is a follower */
      if (user.isPrivate) {
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
    res.status(200).json(filteredUsers)
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
    !(user.isPrivate && !user.showFollowing) ? res.json(user) : res.json(null)
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
    const filteredUsers = []
    const promises = result.followFavorites.map(async (user) => {
      const data = await Users.findOne({ _id: user.playlist.userId })
      if (data.isPrivate) {
        if (data.showFollowing === true) {
          const found = data.following?.some(obj => obj.userId === userId)
          if (found) {
            filteredUsers.push(user)
          }
        }
      } else {
        filteredUsers.push(user)
      }
    })
    await Promise.all(promises)
    res.status(200).json(filteredUsers)
  } catch (error) {
    next(error)
  }
})

module.exports = router
