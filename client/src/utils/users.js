import axios from 'axios'

export const getAllUsers = (followers) => {
  return axios.post('http://localhost:8888/users', {
    followers: followers
  }, {
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

export const getUserLocation = () => {
  return axios.get('http://localhost:8888/users/location', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getUserProfile = () => {
  return axios.get('http://localhost:8888/users/profile', {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const getUserProfileById = (userId) => {
  return axios.get('http://localhost:8888/users/profile-id', {
    headers: {
      "x-access-token": localStorage.getItem('token'),
      "user-id": userId
    }
  })
}

export const addUserFollower = (otherUserId) => {
  return axios.post('http://localhost:8888/users/add-follower', {
    otherUserId: otherUserId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const addUserFollowing = (otherUserId) => {
  return axios.post('http://localhost:8888/users/add-following', {
    otherUserId: otherUserId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const removeUserFollower = (otherUserId) => {
  return axios.post('http://localhost:8888/users/remove-follower', {
    otherUserId: otherUserId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}

export const removeUserFollowing = (otherUserId) => {
  return axios.post('http://localhost:8888/users/remove-following', {
    otherUserId: otherUserId
  }, {
    headers: {
      "x-access-token": localStorage.getItem('token')
    }
  })
}