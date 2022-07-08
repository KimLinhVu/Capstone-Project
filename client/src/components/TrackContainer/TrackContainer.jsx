import React from 'react'
import Track from '../Track/Track'
import { useState } from 'react'

function TrackContainer({
  tracks
}) {
  const [genreArray, setGenreArray] = useState([])
  return (
    <div className="track-container">
      {tracks.map((item, idx) => (
        <Track 
          key={idx} 
          track={item.track} 
          trackNumber={idx}
          genreArray={genreArray}
          setGenreArray={setGenreArray}
        />
      ))}
    </div>
  )
}

export default TrackContainer