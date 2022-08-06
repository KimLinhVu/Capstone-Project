const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const TrackReceipt = require('../models/TrackReceipt')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  /* adds track receipt to db */
  try {
    const userId = req.userId
    const { track, username, similarityScore, playlist, addedAt } = req.body

    const receipt = new TrackReceipt({ userId, track, username, similarityScore, playlist, addedAt })
    await receipt.save()
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  /* returns all track receipts belonging to current user */
  try {
    const userId = req.userId
    const receipts = await TrackReceipt.find({ userId })
    receipts ? res.status(200).json(receipts) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
