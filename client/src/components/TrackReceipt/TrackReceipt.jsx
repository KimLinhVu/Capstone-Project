import React from 'react'
import './TrackReceipt.css'

function TrackReceipt ({
  track,
  playlist,
  similarityScore,
  userId,
  username,
  addedAt,
  setPopupIsOpen,
  setUserPopupId
}) {
  const date = new Date(addedAt).toLocaleDateString()
  return (
    <div className="track-receipt" onClick={() => {
      setUserPopupId(userId)
      setPopupIsOpen(true)
    }}>
      <div className="username">
        <p>{username}</p>
      </div>
      <div className="song">
        <img src={track.image} alt="Track Image"/>
        <div className="song-info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artist}</span>
        </div>
      </div>
      <div className="song">
        <img src={playlist.image} alt="Track Image"/>
        <div className="song-info">
          <span className='title'>{playlist.name}</span>
          <span className='artist'>{playlist.ownerName}</span>
        </div>
      </div>
      <div className="similarity">
        <span>{similarityScore.toFixed(2)}</span>
      </div>
      <div className="time">
        <span>{date}</span>
      </div>
    </div>
  )
}

export default TrackReceipt
