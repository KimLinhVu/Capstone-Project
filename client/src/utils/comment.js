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
