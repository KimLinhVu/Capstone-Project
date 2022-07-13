const axios = require('axios')
/* axios global request headers */
axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Content-Type'] = 'application/json'

const getCurrentUserProfile = async (accessToken) => {
  return axios.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

const getCurrentUserPlaylist = (accessToken) => {
  return axios.get('/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

exports.getCurrentUserProfile = getCurrentUserProfile
exports.getCurrentUserPlaylist = getCurrentUserPlaylist
