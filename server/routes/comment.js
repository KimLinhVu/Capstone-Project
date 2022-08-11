const express = require('express')
const jwt = require('../utils/jwt')
const router = express.Router()

const Comment = require('../models/Comments')

router.post('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { comment, createdAt, otherUserId, playlistId } = req.body
    const newComment = new Comment({ userId, otherUserId, playlistId, comment, createdAt, likes: 0, usersLiked: [], isEdited: false })
    await newComment.save()
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.get('/', jwt.verifyJWT, async (req, res, next) => {
  try {
    /* returns all comments on a users' playlist */
    const userId = req.headers['user-id']
    const playlistId = req.headers['playlist-id']
    const comments = await Comment.find({ otherUserId: userId, playlistId })
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
})

router.post('/remove', jwt.verifyJWT, async (req, res, next) => {
  try {
    const { commentId } = req.body
    await Comment.findOneAndDelete({ _id: commentId })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/add-like', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { commentId } = req.body
    await Comment.findOneAndUpdate({ _id: commentId }, {
      $inc: { likes: 1 },
      $push: {
        usersLiked: { userId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/remove-like', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const { commentId } = req.body
    await Comment.findOneAndUpdate({ _id: commentId }, {
      $inc: { likes: -1 },
      $pull: {
        usersLiked: { userId }
      }
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.post('/edit', jwt.verifyJWT, async (req, res, next) => {
  try {
    const { commentId, comment } = req.body
    await Comment.findOneAndUpdate({ _id: commentId }, {
      comment,
      isEdited: true
    })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
