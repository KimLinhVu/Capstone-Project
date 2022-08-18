const express = require('express')
const router = express.Router()
const SpotifyTrack = require('../models/spotifyTrack')
const Shazam = require('../utils/shazam')

router.post('/', async (req, res, next) => {
  try {
    const { trackId, trackSearchParams } = req.body
    const found = await SpotifyTrack.findOne({ trackId })
    if (!found) {
      /* if not found, make request to API */
      const result = await Shazam.getTrackDetails(trackSearchParams)
      const trackUri = result.data.tracks.hits[0].track.hub.actions[1].uri
      const newTrack = new SpotifyTrack({ trackId, trackUri })
      await newTrack.save()
      res.status(200).json(trackUri)
    } else {
      res.status(200).json(found.trackUri)
    }
  } catch (error) {
    next(error)
  }
})

router.post('/spotify', async (req, res, next) => {
  try {
    const { trackId, trackUri } = req.body
    const found = await SpotifyTrack.findOne({ trackId })
    if (!found) {
      const newTrack = new SpotifyTrack({ trackId, trackUri })
      await newTrack.save()
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
