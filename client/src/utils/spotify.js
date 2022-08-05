import axios from 'axios'

const hasTokenExpired = (accessToken, timeStamp, expiresIn) => {
  if (!accessToken || !timeStamp) {
    return false
  }
  const timeElapsed = Date.now() - timeStamp
  return (timeElapsed / 1000) > Number(expiresIn)
}

const refreshTokens = async (refreshToken) => {
  const { data } = await axios.get(`/spotify/refresh_token?refresh_token=${refreshToken}`)

  await axios.post('/playlist/', {
    accessToken: data.access_token,
    timeStamp: Date.now()
  }, {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })

  window.location.reload()
}

export const logoutSpotify = async () => {
  await axios.delete('/spotify/delete-tokens', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  window.location.reload()
}

export const getSpotifyAccessTokens = async () => {
  const { data } = await axios.get('/spotify/tokens', {
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  const { accessToken, refreshToken, expiresIn, timeStamp } = data

  if (hasTokenExpired(refreshToken, timeStamp, expiresIn) || !accessToken) {
    await refreshTokens(refreshToken)
  }
  return accessToken
}

const instance = axios.create({
  baseURL: 'https://api.spotify.com/v1'
})
instance.defaults.headers['Content-Type'] = 'application/json'

export const getCurrentUserProfile = async () => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getCurrentUserPlaylist = async () => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get('/me/playlists?limit=50', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getPlaylistDetail = async (playlistId) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getPlaylistItems = async (playlistId, offset) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/playlists/${playlistId}/tracks?limit=50&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getTrackDetail = async (trackId) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getTracksDetails = async (trackIdString) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/tracks/?ids=${trackIdString}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getArtistDetail = async (artistId) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/artists?ids=${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const addTrackToPlaylist = async (playlistId, trackUri) => {
  const accessToken = await getSpotifyAccessTokens()
  instance.defaults.headers.Authorization = `Bearer ${accessToken}`
  return instance.post(`/playlists/${playlistId}/tracks?uris=${trackUri}`)
}

export const getTracksAudioFeatures = async (ids) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/audio-features?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const getTrackAudioFeatures = async (id) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.get(`/audio-features/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const removeTrackFromPlaylist = async (playlistId, trackUri) => {
  const accessToken = await getSpotifyAccessTokens()
  return instance.delete(`/playlists/${playlistId}/tracks`, {
    data: {
      tracks: [
        {
          uri: trackUri
        }
      ]
    }
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
