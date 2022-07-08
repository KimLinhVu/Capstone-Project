require('dotenv').config()
const express = require('express')
const querystring = require('querystring')
const axios = require('axios')
const router = express.Router()

router.use(express.json())

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
]

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
    scope: scopes
  })

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
})

router.get('/callback', (req, res) => {
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

        /* redirect to react app on success */
        res.redirect(`http://localhost:3000/?${queryParams}`)
      } else {
        res.redirect(`/?${querystring.stringify({
          error: 'invalid_token'
        })}`)
      }
    })
    .catch(err => {
      res.send(err)
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

module.exports = router
