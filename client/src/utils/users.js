import axios from 'axios'

export const getAllUsers = () => {
  return axios.get('http://localhost:8888/users', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getUserPlaylists = (userId) => {
  return axios.get('http://localhost:8888/users/playlist', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "user-id": userId
    }
  })
}