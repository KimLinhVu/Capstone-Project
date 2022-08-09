import axios from 'axios'

export const postComment = (comment, createdAt, otherUserId, playlistId) => {
  return axios.post('/comment', {
    comment,
    createdAt,
    otherUserId,
    playlistId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getComments = (userId, playlistId) => {
  return axios.get('/comment', {
    headers: {
      'x-access-token': localStorage.getItem('token'),
      'user-id': userId,
      'playlist-id': playlistId
    }
  })
}

export const removeComment = (commentId) => {
  return axios.post('/comment/remove', {
    commentId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const addLike = (commentId) => {
  return axios.post('/comment/add-like', {
    commentId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const removeLike = (commentId) => {
  return axios.post('/comment/remove-like', {
    commentId
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
