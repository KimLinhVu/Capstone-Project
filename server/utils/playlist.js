const axios = require('axios')

const addPlaylists = (playlist, spotifyId, userId) => {
  return axios.post('http://localhost:8888/playlist/', {
    playlist,
    spotifyId,
    userId
  })
}

exports.addPlaylists = addPlaylists
