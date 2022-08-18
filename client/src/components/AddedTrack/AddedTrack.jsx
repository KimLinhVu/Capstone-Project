import React from 'react'
import './AddedTrack.css'
import Similarity from 'utils/similarity'
import { Tooltip } from '@mui/material'

function AddedTrack ({
  track,
  playlist,
  similarityScore,
  ownUsername,
  otherUserId,
  username,
  addedAt,
  setPopupIsOpen,
  setUserPopupId
}) {
  const date = new Date(addedAt).toLocaleDateString()
  const classColor = Similarity.getSimilarityColorClass(similarityScore)

  return (
    <div className="added-track" onClick={() => {
      setUserPopupId(otherUserId)
      setPopupIsOpen(true)
    }}>
      <div className="username">
        <p>{username}</p>
      </div>
      <div className="song">
        <img src={track.image} alt="Track Image"/>
        <div className="song-info">
          <Tooltip title={track.name}>
            <span className='title'>{track.name.length > 15 ? track.name.slice(0, 15).concat('...') : track.name}</span>
          </Tooltip>
          <span className='artist'>{track.artist}</span>
        </div>
      </div>
      <div className="preview">
        <audio controls src={track.trackUri}></audio>
      </div>
      <div className="song playlist">
        <img src={playlist.image} alt="Track Image"/>
        <div className="song-info">
          <Tooltip title={playlist.name}>
            <span className='title'>{playlist.name.length > 20 ? playlist.name.slice(0, 20).concat('...') : playlist.name}</span>
          </Tooltip>
          <span className='artist'>{ownUsername}</span>
        </div>
      </div>
      <div className="similarity">
        <span className={classColor}>{similarityScore.toFixed(2)}</span>
      </div>
      <div className="time">
        <span>{date}</span>
      </div>
    </div>
  )
}

export default AddedTrack
