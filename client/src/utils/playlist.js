import axios from 'axios'

export const getPlaylists = (spotifyId) => {
  return axios.get('/playlist/playlists', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}

export const getUserPlaylists = (userId) => {
  return axios.get('http://localhost:8888/playlist/user-playlists', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'user-id': userId
    }
  })
}

export const getFavoritePlaylists = (spotifyId) => {
  return axios.get('/playlist/favorites', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}

export const getCurrentPlaylists = (spotifyId) => {
  return axios.get('/playlist/current', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}

export const addPlaylists = (playlist, spotifyId) => {
  return axios.post('/playlist/', {
    playlist: playlist,
    spotifyId: spotifyId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addPlaylistToProfile = (playlist) => {
  return axios.post('/playlist/add', {
    playlist: playlist
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removePlaylistFromProfile = (playlistId) => {
  return axios.post('/playlist/remove', {
    playlistId: playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addTrackVector = (playlistId, trackVector) => {
  return axios.post('/playlist/add-track-vector', {
    playlistId: playlistId,
    trackVector: trackVector
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getPlaylistTrackVector = (playlistId) => {
  return axios.get('/playlist/get-track-vector', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'playlist-id': playlistId
    }
  })
}

export const addFavoritePlaylist = (playlistId) => {
  return axios.post('/playlist/add-favorite', {
    playlistId: playlistId,
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeFavoritePlaylist = (playlistId) => {
  return axios.post('/playlist/remove-favorite', {
    playlistId: playlistId,
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addSimilarityMethodCount = (similarityMethod) => {
  return axios.post('/playlist/addSimilarityCount', {
    similarityMethod: similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeSimilarityMethodCount = (similarityMethod) => {
  return axios.post('/playlist/removeSimilarityCount', {
    similarityMethod: similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const saveSimilarityScores = (playlistId, trackVector) => {
  return axios.post('http://localhost:8888/playlist/save-similarity-score', {
    playlistId,
    trackVector
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
