const express = require('express')
const router = express.Router()
const jwt = require('../utils/jwt')
const TrackReceipt = require('../models/TrackReceipt')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  /* adds track receipt to db */
  try {
    const userId = req.userId
    const { otherUserId, track, username, similarityScore, playlist, addedAt } = req.body

    const receipt = new TrackReceipt({ userId, otherUserId, track, username, similarityScore, playlist, addedAt })
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

    /* delete expired receipts */
    const promises = receipts.map(async (receipt) => {
      const receiptDate = new Date(receipt.addedAt)
      const receiptSeconds = receiptDate.getTime() / 1000
      const timeNow = Date.now() / 1000

      /* delete if longer than 7 days */
      if ((timeNow - receiptSeconds) > 604800) {
        await TrackReceipt.findOneAndRemove({ _id: receipt._id })
      }
    })
    await Promise.all(promises)
    const newReceipts = await TrackReceipt.find({ userId })
    newReceipts ? res.status(200).json(newReceipts) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
