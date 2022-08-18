import axios from 'axios'

export const getTrackDetails = (trackId, trackSearchParams) => {
  return axios.post('/spotifyTrack', {
    trackId,
    trackSearchParams
  })
}

export const addSpotifyUri = (trackId, trackUri) => {
  return axios.post('/spotifyTrack/spotify', {
    trackId,
    trackUri
  })
}
