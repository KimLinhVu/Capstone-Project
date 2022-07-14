import axios from 'axios'
// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
  accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES
  if (!accessToken || !timestamp) {
    return false
  }

  const timeElapsed = Date.now() - Number(timestamp)
  return (timeElapsed / 1000) > Number(expireTime)
}

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    localStorage.removeItem(LOCALSTORAGE_KEYS[property])
  }
  window.location = window.location.origin
}

const refreshToken = async () => {
  try {
    if (!LOCALSTORAGE_VALUES.refreshToken || LOCALSTORAGE_VALUES.refreshToken === 'undefined' || 
      (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000) {
      console.error('No refresh token available')
      logout()
    }
    const { data } = await axios.get(`/spotify/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`)

    localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token)
    localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

    window.location.reload()
  } catch (err) {
    
  }
}

const getAccessToken = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in')   
  }
  const hasError = urlParams.get('error')

  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
    refreshToken()
  }

  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
    return LOCALSTORAGE_VALUES.accessToken
  }

  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    /* store query params in local storage */
    for (const prop in queryParams) {
      localStorage.setItem(prop, queryParams[prop])
    }
    localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())
    return queryParams[LOCALSTORAGE_KEYS.accessToken]
  }

  return false
}

export const accessToken = getAccessToken()

/* axios global request headers */
axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

export const getCurrentUserProfile = async () => {
  return axios.get('/me')
}

export const getCurrentUserPlaylist = () => {
  return axios.get('/me/playlists')
}

export const getPlaylistDetail = (playlistId) => {
  return axios.get(`/playlists/${playlistId}`)
}

export const getTrackDetail = (trackId) => {
  return axios.get(`/tracks/${trackId}`)
}

export const getArtistDetail = (artistId) => {
  return axios.get(`/artists?ids=${artistId}`)
}

export const addTrackToPlaylist = async (playlistId, trackUri) => {
  return axios.post(`/playlists/${playlistId}/tracks?uris=${trackUri}`)
}

export const getTracksAudioFeatures = async (ids) => {
  return axios.get(`/audio-features?ids=${ids}`)
}

export const getTrackAudioFeatures = async (id) => {
  return axios.get(`/audio-features/${id}`)
}