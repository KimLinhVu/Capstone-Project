require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')
const router = express.Router()
const spotify = require('../utils/spotify')
const playlist = require('../utils/playlist')
const app = require('../app')
const jwt = require('../utils/jwt')
const jwtToken = require('jsonwebtoken')
const SpotifyToken = require('../models/SpotifyToken')
const Spotify = express()
const { BadRequestError } = require('../utils/errors')
const User = require('../models/Users')
const bcrypt = require('bcrypt')

router.use(express.json())

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const scopes = 'user-read-email user-read-private playlist-modify playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played user-follow-read user-follow-modify'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const stateKey = 'spotify_auth_state'

router.get('/login', (req, res) => {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    scope: scopes,
    show_dialog: true
  })

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
})

router.post('/user-login', async (req, res, next) => {
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
      Spotify.locals.userId = user.id
      const accessToken = jwtToken.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken, userId: user.id })
    }
  })
})

router.get('/callback', (req, res, next) => {
  const code = req.query.code || null

  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI
  })

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
  }

  axios.post('https://accounts.spotify.com/api/token', data, { headers })
    .then(response => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data
        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
          expires_in
        })

        /* store users playlists and tokens in database */
        const storeInitialPlaylist = async () => {
          try {
            /* get user's userId */
            const userId = Spotify.locals.userId
            const prof = await spotify.getCurrentUserProfile(access_token)
            const spotifyId = prof.data.id

            Spotify.locals.spotifyId = spotifyId
            /* store tokens in database */
            const found = await SpotifyToken.findOne( { userId, spotifyId })
            if (found) {
              await SpotifyToken.findOneAndUpdate( { userId, spotifyId}, {
                accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in, timeStamp: Date.now()
              })
            } else {
              const newTokens = new SpotifyToken( { userId, spotifyId, accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in, timeStamp: Date.now()})
              await newTokens.save()
            }
            
            /* get list playlist from Spotify Api */
            const { data } = await spotify.getCurrentUserPlaylist(access_token)
            await playlist.addPlaylists(data.items, prof.data.id, userId)
            /* redirect to react app on success */
            res.redirect(`http://localhost:3000/?${queryParams}`)
          } catch (error) {
            next(error)
          }
        }
        storeInitialPlaylist()
      } else {
        res.redirect(`/?${querystring.stringify({
          error: 'invalid_token'
        })}`)
      }
    })
    .catch(() => {
      res.redirect('http://localhost:3000/')
    })
})

router.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query
  const data = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token
  })
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
  }
  axios.post('https://accounts.spotify.com/api/token', data, { headers })
    .then(response => {
      res.send(response.data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/tokens', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = Spotify.locals.spotifyId
    const tokens = await SpotifyToken.findOne( { userId, spotifyId })
    res.status(200).json(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/tokens', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = Spotify.locals.spotifyId
    const { accessToken, timeStamp } = req.body
    await SpotifyToken.findOneAndUpdate( { userId, spotifyId}, { accessToken, timeStamp })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

router.delete('/delete-tokens', jwt.verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const spotifyId = Spotify.locals.spotifyId
    await SpotifyToken.findOneAndDelete( { userId, spotifyId })
    res.status(200).json()
  } catch (error) {
    next(error)
  }
})

module.exports = router
