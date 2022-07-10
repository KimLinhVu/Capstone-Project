import axios from 'axios'

/* current user */
export const getPlaylists = (spotifyId) => {
  return axios.get('http://localhost:8888/playlist/', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "spotify-id": spotifyId
    }
  })
}

export const getCurrentPlaylists = () => {
  return axios.get('http://localhost:8888/playlist/current', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const addPlaylists = (playlist, spotifyId) => {
  return axios.post('http://localhost:8888/playlist/', {
    playlist: playlist,
    spotifyId: spotifyId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const addPlaylistToProfile = (playlist) => {
  return axios.post('http://localhost:8888/playlist/add', {
    playlist: playlist
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const removePlaylistFromProfile = (playlistId) => {
  return axios.post('http://localhost:8888/playlist/remove', {
    playlistId: playlistId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}
