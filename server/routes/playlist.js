const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Playlist = require('../models/Playlists')
const { BadRequestError } = require('../utils/errors')

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const playlists = await Playlist.find({ userId, added: false })
    res.json(playlists)
  } catch (error) {
    console.log(error)
  }
})

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist } = req.body

    for (let i = 0; i < playlist.length; i++) {
      const playlistItem = await Playlist.findOne({ userId, playlistId: playlist[i].id, playlist: playlist[i] })
      if (!playlistItem) {
        const newPlaylist = new Playlist({ userId, playlistId: playlist[i].id, playlist: playlist[i], added: false })
        await newPlaylist.save()
      }
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/add', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* adds an "added" property to playlist object */
    const userId = req.userId
    const { playlist } = req.body
    console.log(playlist.playlistId)

    await Playlist.findOneAndUpdate({ userId, playlistId: playlist.playlistId }, { added: true })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
