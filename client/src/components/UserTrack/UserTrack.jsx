import React from 'react'
import { addTrackToPlaylist } from 'utils/spotify'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle } from "react-icons/ai";
import { addSimilarityMethodCount } from 'utils/playlist';
import Tracks from 'utils/tracks';
import './UserTrack.css'

function UserTrack({
  playlistId,
  similarityScore,
  similarityMethod,
  trackNumber,
  track,
}) {
  const tracks = new Tracks()

  console.log(track.preview_url)

  const addTrack = async () => {
    const res = await addTrackToPlaylist(playlistId, track.uri)
    
    /* sends success or error toast */
    if (res.status === 201) {
      /* add to similarity method counter */
      await addSimilarityMethodCount(similarityMethod)
      notifySuccess('Track added successfully')
    } else {
      notifyError('Error adding track')
    }
  }
  
  return (
    <div className="user-track">
      <span className='num'>{trackNumber + 1}</span>
      <div className="song">
        <img src={track.album.images[0].url} alt="Track Image"/>
        <div className="song-info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <span className="similarity">{similarityScore.toFixed(2)}</span>
      <div className="time">
        <span className="time">{tracks.convertDuration(track.duration_ms)}</span>
      </div>
      {track.preview_url !== null ? (
        <audio controls src={track.preview_url}></audio>
      ) : <p>No preview available</p>}
      <AiFillPlusCircle onClick={addTrack} id='add'/>
    </div>
  )
}

export default UserTrack