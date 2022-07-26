import React from 'react'
import Tracks from 'utils/tracks'
import './Track.css'

function Track ({
  track,
  trackNumber
}) {
  const tracks = new Tracks()
  return (
    <div className="track">
      <div className="track-left">
        <span className='num'>{trackNumber + 1}</span>
        <img src={track.album.images[0]?.url} alt="Track Image"/>
        <div className="info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <div className="track-right">
        <span className="time">{tracks.convertDuration(track.duration_ms)}</span>
      </div>
    </div>
  )
}

export default Track
