const express = require('express')
const axios = require('axios')
const jwt = require('../utils/jwt')
const router = express.Router()

const Playlist = require('../models/Playlists')

/* try implementing jwt token */
router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist } = req.body

    /* check to see if user has existing playlist in database */
    const user = await Playlist.findOne({ userId })
    if (user) {
      // await Playlist.deleteMany({ userId })
      /* pushes new playlist to current array of playlist in database */
      Playlist.findOneAndUpdate({ uesrId: userId }, { $push: { playlist } }, { new: true }, (err, data) => {
        if (err) {
          console.log(err)
        } else {
          console.log(data)
        }
      })
    } else {
      /* adds User's playlist to playlist database with user's id as an attribute */
      const newPlaylist = await new Playlist({ userId, playlist: [playlist] })
      await newPlaylist.save()
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
