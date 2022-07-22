import { getPlaylistItems } from "./spotify";

export default class Tracks {
  sortOptionsTracks = (options) => {
    options.sort((a, b) => {
      if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
      if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
      return 0;
    })
  }

  getAllPlaylistTracks = async (playlistId) => {
    let allTracks = []
    let offset = 0
    let tracks = await getPlaylistItems(playlistId, offset)
    tracks.data.items.forEach(item => allTracks.push(item))
    
    while (tracks.data.items.length > 0) {
      offset += tracks.data.items.length
      tracks = await getPlaylistItems(playlistId, offset)
      tracks.data.items.forEach(item => allTracks.push(item))
    }
    return allTracks
  }
}