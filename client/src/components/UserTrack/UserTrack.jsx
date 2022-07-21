import React from 'react'
import { addTrackToPlaylist } from 'utils/spotify'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle } from "react-icons/ai";
import Tracks from 'utils/tracks';
import './UserTrack.css'

function UserTrack({
  playlistId,
  similarityScore,
  vector,
  trackNumber,
  track,
}) {
  const tracks = new Tracks()

  const addTrack = async () => {
    const res = await addTrackToPlaylist(playlistId, track.uri)
    /* sends success or error toast */
    if (res.status === 201) {
      notifySuccess('Track added successfully')
    } else {
      notifyError('Error adding track')
    }
  }
  
  return (
    <div className="track">
      <div className="track-left">
        <span className='num'>{trackNumber + 1}</span>
        <img src={track.album.images[0].url} alt="Track Image"/>
        <div className="info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <div className="track-right">
        <span className="time">{tracks.convertDuration(track.duration_ms)}</span>
      </div>
      <button onClick={addTrack}><AiFillPlusCircle id='add'/></button>
      <p>Similarity Score: {similarityScore.toFixed(2)}</p>
    </div>
  )
}

export default UserTrack