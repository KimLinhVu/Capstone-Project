import axios from 'axios'

export const addTrackReceipt = (track, otherUserId, username, similarityScore, playlist, addedAt) => {
  return axios.post('/trackReceipt', {
    track,
    otherUserId,
    username,
    similarityScore,
    playlist,
    addedAt
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getTrackReceipts = () => {
  return axios.get('/trackReceipt', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
