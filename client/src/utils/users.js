import axios from 'axios'

export const getAllUsers = () => {
  return axios.get('/users', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getUserPlaylists = (userId) => {
  return axios.get('/users/playlist', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "user-id": userId
    }
  })
}

export const getUserLocation = () => {
  return axios.get('/users/location', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getUserProfile = () => {
  return axios.get('/users/profile', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}