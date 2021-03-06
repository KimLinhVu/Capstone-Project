const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Playlist = require('../models/Playlists')
const { BadRequestError } = require('../utils/errors')

/* returns all playlists belonging to spotify user */
router.get('/playlists', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = req.headers['spotify-id']
    const playlists = await Playlist.find({ userId, spotifyId, added: false })
    res.json(playlists)
  } catch (error) {
    next(error)
  }
})

/* returns all favorited playlists belonging to spotify user */
router.get('/favorites', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = req.headers['spotify-id']
    const playlists = await Playlist.find({ userId, spotifyId, added: true, favorite: true })
    res.json(playlists)
  } catch (error) {
    next(error)
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
    next(error)
  }
})

/* adds all user's spotify playlists to database */
router.post('/', async (req, res, next) => {
  try {
    const { playlist, spotifyId, userId } = req.body

    playlist.forEach(async (playlist) => {
      /* search for if playlist already exists */
      const playlistItem = await Playlist.findOne({ userId, spotifyId, playlistId: playlist.id })
      if (!playlistItem) {
        const newPlaylist = new Playlist({ userId, spotifyId, playlistId: playlist.id, playlist, added: false, favorite: false })
        await newPlaylist.save()
      }
    })
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

    const found = await Playlist.findOneAndUpdate({ userId, playlistId: playlist.playlistId }, { added: true })
    if (!found) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* removes a spotify playlist from user profile */
router.post('/remove', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* removes 'added' property to playlist object */
    const userId = req.userId
    const { playlistId } = req.body

    const found = await Playlist.findOneAndUpdate({ userId, playlistId }, { added: false })
    if (!found) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* adds a track-vector property to playlist database */
router.post('/add-track-vector', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlistId, trackVector } = req.body

    const found = await Playlist.findOneAndUpdate({ userId, playlistId }, { trackVector })
    if (!found) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* returns a playlist's track vector */
router.get('/get-track-vector', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const playlistId = req.headers['playlist-id']

    const playlist = await Playlist.findOne({ userId, playlistId })
    if (!playlist) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json(playlist.trackVector)
  } catch (error) {
    next(error)
  }
})

/* adds playlist as a favorite playlist */
router.post('/add-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlistId } = req.body

    const found = await Playlist.findOneAndUpdate({ userId, playlistId }, { favorite: true })
    if (!found) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* remove playlist as a favorite playlist */
router.post('/remove-favorite', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlistId } = req.body

    const found = await Playlist.findOneAndUpdate({ userId, playlistId }, { favorite: false })
    if (!found) {
      return next(new BadRequestError('Playlist Not Found'))
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
