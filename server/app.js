const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))

const User = require('./models/Users')
const spotifyRouter = require('./routes/spotify')
const playlistRouter = require('./routes/playlist')
const { BadRequestError } = require('./utils/errors')

app.use('/spotify', spotifyRouter)
app.use('/playlist', playlistRouter)

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
      /* create jwt */
      const salt = bcrypt.genSaltSync(10)
      const hashedUserId = bcrypt.hashSync(user.id, salt)
      const accessToken = jwt.sign({ id: hashedUserId }, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken })
    }
  })
})

/* adds new user to Users db */
app.post('/signup', async (req, res, next) => {
  try {
    const { username, password, location, privacy } = req.body
    /* check to see if username and pw fields are filled out */
    if (!username) {
      return next(new BadRequestError('Missing username field.'))
    }
    if (!password) {
      return next(new BadRequestError('Missing password field.'))
    }

    /* tests for valid password */
    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      return next(new BadRequestError('Password must be at least 8 characters, contain an uppercase letter, and contain a number'))
    }

    /* check to see if username already exists */
    if (await User.findOne({ username })) {
      return next(new BadRequestError('Username already exists. Please try again.'))
    }

    const newUser = await new User({ username, password, location, privacy })
    await newUser.save()
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

module.exports = app
