import { getPlaylistItems, getTracksDetails } from "./spotify";

export default class Tracks {
  sortOptionsTracks = (options) => {
    options.sort((a, b) => {
      if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
      if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
      return 0;
    })
  }

  getAllPlaylistTracks = async (playlistId) => {
    let offset = 0
    let tracks = await getPlaylistItems(playlistId, offset)
    let allTracks = tracks.data.items.map(item => { return item })
    
    while (tracks.data.items.length > 0) {
      offset += tracks.data.items.length
      tracks = await getPlaylistItems(playlistId, offset)
      allTracks.push(tracks.data.items.map(item => { return item }))
    }
    return allTracks.flat()
  }

  getAllTrackDetails = async (tracks) => {
    let trackIds = []
    let trackArray = []
    tracks.forEach(item => trackIds.push(item.id))

    while (trackIds.length > 0) {
      let trackIdString = trackIds.splice(0, 50).join(',')

      const { data } = await getTracksDetails(trackIdString)
      data.tracks.forEach(item => trackArray.push(item))
    }
    return trackArray
  }

  convertDuration = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
}