const axios = require('axios')

const addPlaylists = (playlist, spotifyId, userId) => {
  return axios.post(`${process.env.SERVER_BASE_URL}/playlist/`, {
    playlist,
    spotifyId,
    userId
  })
}

exports.addPlaylists = addPlaylists
