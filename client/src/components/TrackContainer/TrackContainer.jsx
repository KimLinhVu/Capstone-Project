import React, { useEffect } from 'react'
import Track from '../Track/Track'
import { useState } from 'react'

function TrackContainer({
  tracks,
  addPlaylist,
  playlistId
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
          addPlaylist={addPlaylist}
          playlistId={playlistId}
        />
      ))}
      <div className="genres">
        <h2>Top Genres in Playlist</h2>
        {genreArray.slice(0, 5).map((item, idx) => {
          return <p key={idx}>{item.genre}</p>
        })}
      </div>
    </div>
  )
}

export default TrackContainer