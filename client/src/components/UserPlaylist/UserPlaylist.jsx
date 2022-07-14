import React from 'react'
import { Link } from 'react-router-dom'
import './UserPlaylist.css'

function User({
  user,
  playlist,
  similarity,
  playlistId
}) {

  return (
    <div className='user-playlist'>
      <h2>{user.username}</h2>
      {/* <p>{user.location.formatted_address}</p> */}
      {playlist ? (
        <div className='playlist-card'>
          <p>{playlist.name}</p>
          <p>Similarity Score: {similarity}</p>
          <Link to={`/recommend/playlist/${playlist.id}/${playlistId}`}><img src={playlist.images[0].url}/></Link>
        </div>
      ) : null}
    </div>
  )
}

export default User