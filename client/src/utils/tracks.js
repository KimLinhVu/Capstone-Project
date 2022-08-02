import { getPlaylistItems, getTracksDetails, getTracksAudioFeatures, getPlaylistDetail, getCurrentUserProfile } from './spotify'
import Similarity from './similarity'
import { getPlaylists } from './playlist'

export default class Tracks {
  similar = new Similarity()

  createTrackVector = async (playlistId, setPlaylist) => {
    const { data } = await getPlaylistDetail(playlistId)
    if (setPlaylist) {
      setPlaylist(data)
    }

    /* create string of track Ids to use in Spotify API */
    const trackIdArray = []
    const tracks = await this.getAllPlaylistTracks(data.id)
    tracks.forEach(item => {
      if (item.track !== null) {
        trackIdArray.push(item.track.id)
      }
    })

    /* receive track audio features for each track and store in an array */
    let trackArrayLength = trackIdArray.length
    const tempTrackVector = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      key: 0,
      liveness: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      time_signature: 0,
      valence: 0
    }
    while (trackIdArray.length > 0) {
      const trackIdString = trackIdArray.splice(0, 100).join(',')
      const { data } = await getTracksAudioFeatures(trackIdString)
      // eslint-disable-next-line no-loop-func
      data.audio_features.forEach(item => {
        if (item !== null) {
          this.createTrackObject(tempTrackVector, item)
        } else {
          trackArrayLength -= 1
        }
      })
    }

    /* take average of all track vector quantities */
    Object.keys(tempTrackVector).forEach(key => {
      tempTrackVector[key] /= trackArrayLength
    })
    return tempTrackVector
  }

  createTrackObject = (tempTrackVector, item) => {
    Object.keys(tempTrackVector).forEach(key => {
      let itemValue = item[key]
      /* scale certain values down to 0-1 */
      if (key === 'key') {
        const scaledValue = this.similar.normalizeData(item[key], 0, 11, 1)
        itemValue = scaledValue
      } else if (key === 'loudness') {
        const scaledValue = this.similar.normalizeData(item[key], -60, 0, 1)
        itemValue = scaledValue
      } else if (key === 'time_signature') {
        const scaledValue = this.similar.normalizeData(item[key], 3, 7, 1)
        itemValue = scaledValue
      }
      tempTrackVector[key] += itemValue
    })
  }

  createOptions = async (added) => {
    const prof = await getCurrentUserProfile()
    const { data } = await getPlaylists(prof.data.id, added)
    const options = this.convertToOptionsArray(data)

    const filterOptions = options.filter((item) => {
      return item.value.spotifyId === item.value.playlist.owner.id
    })
    this.sortOptionsTracks(filterOptions)
    return filterOptions
  }

  convertToOptionsArray = (playlist) => {
    const newArray = playlist?.map(item => {
      return { key: item.playlist.id, value: item, label: item.playlist.name }
    })
    return newArray
  }

  sortOptionsTracks = (options) => {
    options.sort((a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) { return -1 }
      if (a.label.toLowerCase() > b.label.toLowerCase()) { return 1 }
      return 0
    })
  }

  getAllPlaylistTracks = async (playlistId) => {
    let offset = 0
    let tracks = await getPlaylistItems(playlistId, offset)
    const allTracks = tracks.data.items.map(item => item)

    while (tracks.data.items.length > 0) {
      offset += tracks.data.items.length
      tracks = await getPlaylistItems(playlistId, offset)
      allTracks.push(tracks.data.items.map(item => item))
    }
    return allTracks.flat()
  }

  getAllTrackDetails = async (tracks) => {
    const trackArray = []
    const trackIds = tracks.map(item => item.id)

    while (trackIds.length > 0) {
      const trackIdString = trackIds.splice(0, 50).join(',')

      const { data } = await getTracksDetails(trackIdString)
      trackArray.push(data.tracks.map(item => item))
    }
    return trackArray.flat()
  }

  convertDuration = (millis) => {
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
  }
}
