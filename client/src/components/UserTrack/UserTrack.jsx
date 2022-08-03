import React, { useState } from 'react'
import { addTrackToPlaylist, removeTrackFromPlaylist } from 'utils/spotify'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { addSimilarityMethodCount, removeSimilarityMethodCount } from 'utils/playlist'
import './UserTrack.css'

function UserTrack ({
  playlistId,
  similarityScore,
  similarityMethod,
  trackNumber,
  track,
  userTrackVector,
  setPopupIsOpen,
  setUserTrack
}) {
  const [add, setAdd] = useState(true)
  let trackButton

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

  if (add) {
    trackButton = <AiFillPlusCircle onClick={(e) => {
      addTrack()
      e.stopPropagation()
    }} className='icon' size={30}/>
  } else {
    trackButton = <AiFillMinusCircle onClick={(e) => {
      removeTrack()
      e.stopPropagation()
    }} className='icon' size={30}/>
  }

  return (
    <div className="user-track" onClick={() => {
      setPopupIsOpen(true)
      setUserTrack({ vector: userTrackVector, name: track.name })
    }}>
      <span className='num'>{trackNumber + 1}</span>
      <div className="song">
        <img src={track.album.images[0].url} alt="Track Image"/>
        <div className="song-info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <div className="similarity">
        <span>{similarityScore?.toFixed(2)}</span>
      </div>
      <div className="preview">
        {track.preview_url !== null
          ? (
          <audio controls src={track.preview_url}></audio>
            )
          : <p className='no-preview'>No preview available</p>}
      </div>
      {trackButton}
    </div>
  )
}

export default UserTrack
