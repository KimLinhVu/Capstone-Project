import axios from 'axios'

export const getPlaylists = (spotifyId) => {
  return axios.get('http://localhost:8888/playlist', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "spotify-id": spotifyId
    }
  })
}

export const getCurrentPlaylists = (spotifyId) => {
  return axios.get('http://localhost:8888/playlist/current', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "spotify-id": spotifyId
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

export const addTrackVector = (playlistId, trackVector) => {
  return axios.post('http://localhost:8888/playlist/add-track-vector', {
    playlistId: playlistId,
    trackVector: trackVector
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getPlaylistTrackVector = (playlistId) => {
  return axios.get('http://localhost:8888/playlist/get-track-vector', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "playlist-id": playlistId
    }
  })
}

export const sortOptionsTracks = (options) => {
  options.sort((a, b) => {
    if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
    if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
    return 0;
  })
}