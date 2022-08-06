import axios from 'axios'

export const addTrackReceipt = (track, username, similarityScore) => {
  return axios.post('/trackReceipt', {
    track,
    username,
    similarityScore
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
