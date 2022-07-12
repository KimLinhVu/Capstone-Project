const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Playlist = require('../models/Playlists')

/* returns all playlists belonging to spotify user */
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

/* returns all playlists added to user profile */
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

/* adds all user's spotify playlists to database */
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

/* adds a spotify playlist to user profile */
router.post('/add', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* adds an "added" property to playlist object */
    const userId = req.userId
    const { playlist } = req.body

    await Playlist.findOneAndUpdate({ userId, playlistId: playlist.playlistId }, { added: true })
    res.status(200).json()
  } catch (error) {
    console.log(error)
  }
})

/* removes a spotify playlist from user profile */
router.post('/remove', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* removes 'added' property to playlist object */
    const userId = req.userId
    const { playlistId } = req.body

    await Playlist.findOneAndUpdate({ userId, playlistId }, { added: false })
    res.status(200).json()
  } catch (error) {
    console.log(error)
  }
})

/* adds a track-vector property to playlist database */
router.post('/add-track-vector', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlistId, trackVector } = req.body

    await Playlist.findOneAndUpdate({ userId, playlistId }, { trackVector })
    res.status(200).json()
  } catch (error) {
    console.log(error)
  }
})

/* returns a playlist's track vector */
router.get('/get-track-vector', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const playlistId = req.headers['playlist-id']

    const playlist = await Playlist.findOne({ userId, playlistId })
    console.log(playlist)
    res.status(200).json(playlist.trackVector)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
