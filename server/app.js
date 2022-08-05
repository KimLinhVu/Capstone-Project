const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwtUtil = require('./utils/jwt')
const Similarity = require('./utils/similarity')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))

const User = require('./models/Users')
const spotifyRouter = require('./routes/spotify')
const playlistRouter = require('./routes/playlist')
const userRouter = require('./routes/users')
const trackFactor = require('./routes/trackFactor')
const { BadRequestError } = require('./utils/errors')

app.use('/trackFactor', trackFactor)
app.use('/spotify', spotifyRouter)
app.use('/playlist', playlistRouter)
app.use('/users', userRouter)

const devPassword = 'test123'

mongoose.connect('mongodb://localhost:27017/Spotify-Project').then(() => {
  console.log('Database connected...')
}).catch(err => {
  console.log('Database not connected ' + err)
})

/* adds new user to Users db */
app.post('/signup', async (req, res, next) => {
  try {
    const { username, password, location, privacy, showFollowing } = req.body
    /* check to see if username and pw fields are filled out */
    if (!username) {
      return next(new BadRequestError('Missing username field.'))
    }
    if (!password) {
      return next(new BadRequestError('Missing password field.'))
    }

    /* tests for valid password */
    if (password === devPassword) {
      /* allow test123 as a pw while developing */
    } else if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      return next(new BadRequestError('Password must be at least 8 characters, contain an uppercase letter, and contain a number'))
    }

    /* check to see if username already exists */
    if (await User.findOne({ username })) {
      return next(new BadRequestError('Username already exists. Please try again.'))
    }

    /* determine similarity method based on counter in id */
    const user = new User({ username, password, location, isPrivate: privacy, showFollowing, following: [], followers: [] })
    const similarityMethod = await Similarity.getSimilarityMethod(user.id)
    await user.save()
    await User.findOneAndUpdate({ username }, { similarityMethod })

    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

app.post('/verify-token', (req, res) => {
  const { token } = req.body
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401).send('Failed to authenticate')
    } else {
      res.status(200).send('Successfully Authenticated')
    }
  })
})

/* updates user settings */
app.post('/settings', jwtUtil.verifyJWT, async (req, res, next) => {
  try {
    const { username, location, privacy, showFollowing } = req.body
    const userId = req.userId

    /* check to see if username is already taken */
    if (await User.findOne({ _id: { $ne: userId }, username })) {
      return next(new BadRequestError('Username already exists. Please try again.'))
    }

    /* check if location is valid */
    if (!location) {
      return next(new BadRequestError('Location is invalid.'))
    }

    /* update settings */
    await User.findOneAndUpdate({ _id: userId }, { username, isPrivate: privacy, location, showFollowing })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

/* add generic error handler */
app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || "Something wen't wrong in the application"

  return res.status(status).json({ error: { message, status } })
})

const getUserId = () => {
  return app.locals.userId
}

exports.getUserId = getUserId
module.exports = app
