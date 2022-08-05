import axios from 'axios'

export const getPlaylists = (spotifyId, added) => {
  return axios.get('/playlist/playlists', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId,
      added
    }
  })
}

export const getUserPlaylists = (userId) => {
  return axios.get('/playlist/user-playlists', {
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
    playlist,
    spotifyId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addPlaylistToProfile = (playlist) => {
  return axios.post('/playlist/add', {
    playlist
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removePlaylistFromProfile = (playlistId) => {
  return axios.post('/playlist/remove', {
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addTrackVector = (playlistId, trackVector) => {
  return axios.post('/playlist/add-track-vector', {
    playlistId,
    trackVector
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
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeFavoritePlaylist = (playlistId) => {
  return axios.post('/playlist/remove-favorite', {
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addSimilarityMethodCount = (similarityMethod) => {
  return axios.post('/playlist/addSimilarityCount', {
    similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeSimilarityMethodCount = (similarityMethod) => {
  return axios.post('/playlist/removeSimilarityCount', {
    similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const saveSimilarityScores = (playlistId, trackVector) => {
  return axios.post('/playlist/save-similarity-score', {
    playlistId,
    trackVector
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getSimilarityScore = (firstPlaylistId, secondPlaylistId, similarityMethod) => {
  return axios.get('/playlist/get-similarity-score', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'first-playlist-id': firstPlaylistId,
      'second-playlist-id': secondPlaylistId,
      'similarity-method': similarityMethod
    }
  })
}

export const getRandomUserPlaylist = (spotifyId) => {
  return axios.get('/playlist/get-random-playlist', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}
