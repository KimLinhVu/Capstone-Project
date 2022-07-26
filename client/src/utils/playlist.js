import axios from 'axios'

export const getPlaylists = (spotifyId) => {
  return axios.get('http://localhost:8888/playlist/playlists', {
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
  return axios.get('http://localhost:8888/playlist/favorites', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}

export const getCurrentPlaylists = (spotifyId) => {
  return axios.get('http://localhost:8888/playlist/current', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'spotify-id': spotifyId
    }
  })
}

export const addPlaylists = (playlist, spotifyId) => {
  return axios.post('http://localhost:8888/playlist/', {
    playlist,
    spotifyId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addPlaylistToProfile = (playlist) => {
  return axios.post('http://localhost:8888/playlist/add', {
    playlist
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removePlaylistFromProfile = (playlistId) => {
  return axios.post('http://localhost:8888/playlist/remove', {
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addTrackVector = (playlistId, trackVector) => {
  return axios.post('http://localhost:8888/playlist/add-track-vector', {
    playlistId,
    trackVector
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getPlaylistTrackVector = (playlistId) => {
  return axios.get('http://localhost:8888/playlist/get-track-vector', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'playlist-id': playlistId
    }
  })
}

export const addFavoritePlaylist = (playlistId) => {
  return axios.post('http://localhost:8888/playlist/add-favorite', {
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeFavoritePlaylist = (playlistId) => {
  return axios.post('http://localhost:8888/playlist/remove-favorite', {
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addSimilarityMethodCount = (similarityMethod) => {
  return axios.post('http://localhost:8888/playlist/addSimilarityCount', {
    similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeSimilarityMethodCount = (similarityMethod) => {
  return axios.post('http://localhost:8888/playlist/removeSimilarityCount', {
    similarityMethod
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
