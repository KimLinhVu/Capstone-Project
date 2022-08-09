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
      const newImage = new Images({ userId, pfpBase64: base64 })
      await newImage.save()
    } else {
      await Images.findOneAndUpdate({ userId }, { pfpBase64: base64 })
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
    image ? res.status(200).json(image.pfpBase64) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

router.post('/background', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { base64 } = req.body

    const found = await Images.findOne({ userId })
    if (!found) {
      const newImage = new Images({ userId, backgroundBase64: base64 })
      await newImage.save()
    } else {
      await Images.findOneAndUpdate({ userId }, { backgroundBase64: base64 })
    }
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.get('/background', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const image = await Images.findOne({ userId })
    image ? res.status(200).json(image.backgroundBase64) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

router.get('/user', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.headers['user-id']
    const image = await Images.findOne({ userId })
    image ? res.status(200).json(image.pfpBase64) : res.status(200).json(null)
  } catch (error) {
    next(error)
  }
})

module.exports = router
