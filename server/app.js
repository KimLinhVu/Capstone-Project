const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

const User = require('./Users')
const { BadRequestError } = require('./utils/errors')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

/* connect mongo Users database */
mongoose.connect(process.env.MONGO_URI, { dbName: 'Users' }).then(() => {
  console.log('Database Connected')
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

  /* search db for pw that matches correct user */
  const user = await User.findOne({ username, password })
  if (user) {
    res.status(200).json({ token: 'test123' })
  } else {
    return next(new BadRequestError('User does not exist or password does not match.'))
  }
})

/* adds new user to Users db */
app.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body
    /* check to see if username and pw fields are filled out */
    if (!username) {
      return next(new BadRequestError('Missing username field.'))
    }
    if (!password) {
      return next(new BadRequestError('Missing password field.'))
    }

    /* check to see if username already exists */
    if (await User.findOne({ username })) {
      return next(new BadRequestError('Username already exists. Please try again.'))
    }

    const newUser = await User.create({
      username,
      password
    })
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
