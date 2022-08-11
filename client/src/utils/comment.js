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

export const editComment = (commentId, comment) => {
  return axios.post('/comment/edit', {
    commentId,
    comment
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const calculateCommentDate = (date) => {
  const commentDate = new Date(date)
  const currentDate = new Date(Date.now())
  const difference = currentDate.getTime() - commentDate.getTime()

  const diffMinutes = Math.floor((difference / 1000) / 60)
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? `${diffMinutes} minute ago` : `${diffMinutes} minutes ago`
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60)
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`
  } else {
    const days = Math.floor((diffMinutes / 60) / 24)
    return days === 1 ? `${days} day ago` : `${days} days ago`
  }
}
