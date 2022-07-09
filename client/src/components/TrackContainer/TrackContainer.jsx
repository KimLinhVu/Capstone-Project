import React, { useEffect } from 'react'
import Track from '../Track/Track'
import { useState } from 'react'

function TrackContainer({
  tracks
}) {
  const [genreArray, setGenreArray] = useState([])

  useEffect(() => {
    const sortedArray = getTopGenres()
    console.log(sortedArray)
  }, [genreArray])

  const getTopGenres = () => {
    const newArray = genreArray
    newArray.sort((a, b) => (a.count > b.count) ? 1 : -1)
    return newArray
  }
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