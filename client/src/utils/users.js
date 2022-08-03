import axios from 'axios'

export const login = (username, password) => {
  return axios.post('/spotify/user-login',
    {
      username,
      password
    })
}

export const signup = (username, password, location, privacy, showFollowing) => {
  return axios.post('/signup',
    {
      username,
      password,
      location,
      privacy,
      showFollowing
    })
}

export const getAllUsers = (followers) => {
  return axios.post('/users', {
    followers
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getUserPlaylists = (userId) => {
  return axios.get('/users/playlist', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'user-id': userId
    }
  })
}

export const getUserLocation = () => {
  return axios.get('/users/location', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getUserProfile = () => {
  return axios.get('/users/profile', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getUserProfileById = (userId) => {
  return axios.get('/users/profile-id', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'user-id': userId
    }
  })
}

export const getUserFollowerProfile = (userId) => {
  return axios.get('/users/follow-profile-id', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'user-id': userId
    }
  })
}

export const addUserFollower = (otherUserId) => {
  return axios.post('/users/add-follower', {
    otherUserId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addUserFollowing = (otherUserId) => {
  return axios.post('/users/add-following', {
    otherUserId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeUserFollower = (otherUserId) => {
  return axios.post('/users/remove-follower', {
    otherUserId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeUserFollowing = (otherUserId) => {
  return axios.post('/users/remove-following', {
    otherUserId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const updateUserSettings = (username, location, privacy, showFollowing) => {
  return axios.post('/settings', {
    username,
    location,
    privacy,
    showFollowing
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
