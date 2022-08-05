const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Images = require('../models/Images')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { base64 } = req.body

    const found = await Images.findOne({ userId })
    if (!found) {
      const newImage = new Images({ userId, base64 })
      await newImage.save()
    } else {
      await Images.findOneAndUpdate({ userId }, { base64 })
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const image = await Images.findOne({ userId })
    image ? res.status(200).json(image.base64) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
