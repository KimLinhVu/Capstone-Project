const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Similarity = require('../utils/similarity')
const similarity = new Similarity()
const Playlist = require('../models/Playlists')
const SimilarityCount = require('../models/SimilarityCount')
const PlaylistSimilarity = require('../models/PlaylistSimilarity')

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

/* returns all favorited playlists belonging to a userId */
router.get('/user-playlists', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.headers['user-id']
    const playlists = await Playlist.find({ userId, added: true, favorite: true })
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

  }
})

/* adds all user's spotify playlists to database */
router.post('/', async (req, res, next) => {
  try {
    const { playlist, spotifyId, userId } = req.body
    const promises = playlist.map(async (playlist) => {
      const playlistItem = await Playlist.findOne({ userId, spotifyId, playlistId: playlist.id })
      if (!playlistItem) {
        const newPlaylist = new Playlist({ userId, spotifyId, playlistId: playlist.id, playlist, added: false, favorite: false })
        await newPlaylist.save()
      }
    })
    await Promise.all(promises)
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
    next(error)
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
    next(error)
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
    next(error)
  }
})

/* returns a playlist's track vector */
router.get('/get-track-vector', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const playlistId = req.headers['playlist-id']

    const playlist = await Playlist.findOne({ userId, playlistId })
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

    await Playlist.findOneAndUpdate({ userId, playlistId }, { favorite: true })
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

    await Playlist.findOneAndUpdate({ userId, playlistId }, { favorite: false })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* adds to similarity count */
router.post('/addSimilarityCount', jwt.verifyJWT, async (req, res, next) => {
  try {
    const { similarityMethod } = req.body

    /* check to see if similaritymethod counter has been created yet */
    const found = await SimilarityCount.findOne({ similarityMethod })
    if (!found) {
      /* create new entry with count set to 1 */
      const newSimilarity = new SimilarityCount({ similarityMethod, count: 1 })
      await newSimilarity.save()
    } else {
      /* increment similarity count by one */
      await SimilarityCount.findOneAndUpdate({ similarityMethod }, { $inc: { count: 1 } })
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* removes from similarity count */
router.post('/removeSimilarityCount', jwt.verifyJWT, async (req, res, next) => {
  try {
    const { similarityMethod } = req.body

    /* check to see if similaritymethod counter has been created yet */
    const found = await SimilarityCount.findOne({ similarityMethod })
    if (!found) {
      /* decrement similarity count by one */
      await SimilarityCount.findOneAndUpdate({ similarityMethod }, { $inc: { count: -1 } })
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* calculates and saves similarity scores between playlist and
all other playlists in database */
router.post('/save-similarity-score', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { playlistId, trackVector } = req.body

    const allPlaylists = await Playlist.find({ _id: { $ne: userId }, added: true })

    const promises = allPlaylists.map(async (item) => {
      /* see if entry already exists in db */
      const found = await PlaylistSimilarity.findOne({ userId, firstPlaylistId: playlistId, secondPlaylistId: item.playlistId })

      /* fetch both playlist track vectors */
      const firstVector = trackVector
      const secondVector = item.trackVector

      const cosineSimilarityScore = similarity.calculateCosineSimilarity(firstVector, secondVector)
      const ownSimilarityScore = similarity.calculateOwnSimilarity(firstVector, secondVector)

      /* if not found, calculate similarity score and save in db */
      if (!found) {
        const newEntry = new PlaylistSimilarity({ userId, firstPlaylistId: playlistId, secondPlaylistId: item.playlistId, cosineSimilarityScore, ownSimilarityScore })
        await newEntry.save()
      } else {
        /* find one and update */
        await PlaylistSimilarity.findOneAndUpdate({ userId, firstPlaylistId: playlistId, secondPlaylistId: item.playlistId }, { cosineSimilarityScore, ownSimilarityScore })
      }
    })
    await Promise.all(promises)
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* returns similarity score between playlists */
router.get('/get-similarity-score', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const firstPlaylistId = req.headers['first-playlist-id']
    const secondPlaylistId = req.headers['second-playlist-id']
    const similarityMethod = req.headers['similarity-method']

    const result = await PlaylistSimilarity.findOne({ userId, firstPlaylistId, secondPlaylistId })

    if (similarityMethod === 0) {
      res.status(200).json(result.cosineSimilarityScore)
    } else {
      res.status(200).json(result.ownSimilarityScore)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
