const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Playlist = require('../models/Playlists')

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = req.headers['spotify-id']
    const playlists = await Playlist.find({ userId, spotifyId, added: false })
    res.json(playlists)
  } catch (error) {
    console.log(error)
  }
})

router.get('/current', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = req.headers['spotify-id']
    const playlists = await Playlist.find({ userId, spotifyId, added: true })
    res.json(playlists)
  } catch (error) {
    console.log(error)
  }
})

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlist, spotifyId } = req.body

    /* search for if playlist already exists */
    const playlistItem = await Playlist.findOne({ userId, spotifyId, playlistId: playlist.id })
    if (!playlistItem) {
      const newPlaylist = new Playlist({ userId, spotifyId, playlistId: playlist.id, playlist, added: false })
      await newPlaylist.save()
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

    await Playlist.findOneAndUpdate({ userId, playlistId: playlist.playlistId }, { added: true })
  } catch (error) {
    console.log(error)
  }
})

router.post('/remove', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* removes 'added' property to playlist object */
    const userId = req.userId
    const { playlistId } = req.body

    await Playlist.findOneAndUpdate({ userId, playlistId }, { added: false })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
