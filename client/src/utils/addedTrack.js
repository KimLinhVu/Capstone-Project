import axios from 'axios'

export const addTrackRecord = (track, otherUserId, username, similarityScore, playlist, addedAt) => {
  return axios.post('/addedTrack', {
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

export const getAddedTrackRecords = () => {
  return axios.get('/addedTrack', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}

export const getFollowingAddedTrackRecords = () => {
  return axios.get('/addedTrack/following', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
}
