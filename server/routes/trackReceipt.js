const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const TrackReceipt = require('../models/TrackReceipt')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { track, username, similarityScore } = req.body

    const receipt = new TrackReceipt({ userId, track, username, similarityScore })
    await receipt.save()
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
