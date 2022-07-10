import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { getTrackDetail, getArtistDetail, addTrackToPlaylist } from '../../utils/spotify'
import './Track.css'

function Track({
  track,
  trackNumber,
  addPlaylist,
  playlistId
}) {

  const addTrack = async () => {
    try {
      const res = await addTrackToPlaylist(playlistId, track.uri)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="track">
      <span>{trackNumber + 1}</span>
      <p>{track.name}</p>
      <img src={track.album.images[0].url} alt="Track Image"/>
      {addPlaylist ? <button onClick={addTrack}>Add Song To Playlist</button> : null}
    </div>
  )
}

export default Track