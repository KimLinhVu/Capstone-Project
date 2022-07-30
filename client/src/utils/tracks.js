import { getPlaylistItems, getTracksDetails } from './spotify'

export default class Tracks {
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
