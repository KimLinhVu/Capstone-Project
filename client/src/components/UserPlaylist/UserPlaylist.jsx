import React from 'react'
import { Link } from 'react-router-dom'
import './UserPlaylist.css'

function UserPlaylist ({
  user,
  playlist,
  similarity,
  playlistId,
  similarityMethod,
  vector,
  userVector
}) {
  const data = {
    similarityMethod,
    originalPlaylistId: playlistId,
    user,
    vector,
    userVector
  }

  return (
    <Link to={`/user/${playlist.id}`} state={data} style={{ textDecoration: 'none' }}><div className='user-playlist'>
      <div className="left">
        <img src={playlist.images[0].url}/>
        <div className="info">
          <span className='username'>{user.username}</span>
          <span className="playlist-title">{playlist.name}</span>
        </div>
      </div>
      <div className="right">
        <button className='similarity'>{similarity}</button>
      </div>
    </div></Link>
  )
}

export default UserPlaylist
