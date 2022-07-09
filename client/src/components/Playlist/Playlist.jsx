import React from 'react'
import { Link } from 'react-router-dom'
import "./Playlist.css"

function Playlist({
  playlist
}) {
  return (
    <div className='playlist-card'>
      <h2>{playlist.name}</h2>
      <Link to={`playlist/${playlist.id}`}><img src={playlist.images[0].url} alt="Playlist Image"/></Link>
    </div>
  )
}

export default Playlist