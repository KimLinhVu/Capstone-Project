const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const similarity = require('./utils/similarity')
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
const { BadRequestError } = require('./utils/errors')

app.use('/spotify', spotifyRouter)
app.use('/playlist', playlistRouter)
app.use('/users', userRouter)

mongoose.connect('mongodb://localhost:27017/Spotify-Project').then(() => {
  console.log('Database connected...')
}).catch(err => {
  console.log('Database not connected ' + err)
})

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  if (!username) {
    return next(new BadRequestError('Missing username field.'))
  }
  if (!password) {
    return next(new BadRequestError('Missing password field.'))
  }

  /* decrypt hashed password */
  /* search db for pw that matches correct user */
  const user = await User.findOne({ username })
  bcrypt.compare(password, user?.password, function (err, result) {
    if (err || !result) {
      return next(new BadRequestError('User does not exist or password does not match.'))
    } else {
      /* create jwt and store userId */
      app.locals.userId = user.id
      const userId = user.id
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken, userId })
    }
  })
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
    if (password === 'test123') {
      /* allow test123 as a pw while developing */
    } else if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      return next(new BadRequestError('Password must be at least 8 characters, contain an uppercase letter, and contain a number'))
    }

    /* check to see if username already exists */
    if (await User.findOne({ username })) {
      return next(new BadRequestError('Username already exists. Please try again.'))
    }

    /* randomly decide which similarity method user receives */
    const tempUser = new User({ username })

    /* determine similarity method based on counter in id */
    const similarityMethod = await similarity.getSimilarityMethod(tempUser.id)
    const user = new User({ username, password, location, privacy, showFollowing, following: [], followers: [], similarityMethod })

    await user.save()
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
