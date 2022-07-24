import React from 'react'
import { useState } from 'react';
import { addTrackToPlaylist, removeTrackFromPlaylist } from 'utils/spotify'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { addSimilarityMethodCount, removeSimilarityMethodCount} from 'utils/playlist';
import Tracks from 'utils/tracks';
import './UserTrack.css'

function UserTrack({
  playlistId,
  similarityScore,
  similarityMethod,
  trackNumber,
  track,
  vector,
  userTrackVector,
  setPopupIsOpen,
  setUserTrack
}) {
  const [add, setAdd] = useState(true)
  const tracks = new Tracks()

  const addTrack = async () => {
    const res = await addTrackToPlaylist(playlistId, track.uri)
    
    /* sends success or error toast */
    if (res.status === 201) {
      setAdd(false)
      /* add to similarity method counter */
      await addSimilarityMethodCount(similarityMethod)
      notifySuccess('Track added successfully')
    } else {
      notifyError('Error adding track')
    }
  }

  const removeTrack = async () => {
    const res = await removeTrackFromPlaylist(playlistId, track.uri)
    /* sends success or error toast */
    if (res.status === 200) {
      setAdd(true)
      /* remove from similarity method counter */
      await removeSimilarityMethodCount(similarityMethod)
      notifySuccess('Track removed successfully')
    } else {
      notifyError('Error removing track')
    }
  }
  
  return (
    <div className="user-track" onClick={() => {
      setPopupIsOpen(true)
      setUserTrack({ vector: userTrackVector, name: track.name})
    }}>
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
      {add ? <AiFillPlusCircle onClick={(e) => {
        addTrack()
        e.stopPropagation()
      }} className='icon' size={30}/> : <AiFillMinusCircle onClick={(e) => {
        removeTrack()
        e.stopPropagation()
      }} className='icon' size={30}/>}
    </div>
  )
}

export default UserTrack