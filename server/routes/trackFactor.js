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
    const { feature, value } = req.body
    await TrackFactor.findOneAndUpdate({}, { [feature]: value })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
