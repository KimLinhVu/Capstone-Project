const express = require('express')
const router = express.Router()
const TrackFactor = require('../models/TrackFactors')

router.get('/', async (req, res, next) => {
  try {
    const result = await TrackFactor.findOne()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { trackFactor } = req.body
    const newTrackFactor = new TrackFactor(trackFactor)
    await TrackFactor.findOneAndDelete({})
    await newTrackFactor.save()
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
