import React from 'react'
import { Link } from 'react-router-dom'
import './UserPlaylist.css'

function UserPlaylist({
  user,
  playlist,
  similarity,
  playlistId,
  similarityMethod
}) {

  const data = {
    similarityMethod: similarityMethod,
    originalPlaylistId: playlistId,
    user: user,
  }

  return (
    <div className='user-playlist'>
      <h2>{user.username}</h2>
      {playlist ? (
        <div className='playlist-card'>
          <p>{playlist.name}</p>
          <p>Similarity Method: {similarityMethod === 0 ? 'Cosine' : 'Own'}</p>
          <p>Similarity Score: {similarity}</p>
          <Link to={`/user/${playlist.id}`} state={data}><img src={playlist.images[0].url}/></Link>
        </div>
      ) : null}
    </div>
  )
}

export default UserPlaylist