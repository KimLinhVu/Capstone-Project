import React from 'react'
import { Link } from 'react-router-dom'

function User({
  user,
  playlist,
  similarity,
  playlistId
}) {

  return (
    <div className='user'>
      <h2>{user.username}</h2>
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