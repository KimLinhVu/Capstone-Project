import axios from 'axios'

export const getPlaylists = () => {
  return axios.get('http://localhost:8888/playlist/', {
    headers: {
      "x-access-token": localStorage.getItem('token')
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

export const addPlaylists = (playlist) => {
  return axios.post('http://localhost:8888/playlist/', {
    playlist: playlist
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