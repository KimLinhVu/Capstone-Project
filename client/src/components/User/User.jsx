import React from 'react'
import { useState, useEffect } from 'react'
import { getUserPlaylists } from '../../utils/users'
import { Link } from 'react-router-dom'

function User({
  user,
  userId,
  playlistId
}) {
  const [playlist, setPlaylist] = useState(null)
  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await getUserPlaylists(userId)
      setPlaylist(data)
    }
    fetchPlaylist()
  }, [])

  return (
    <div className='user'>
      <h2>{user.username}</h2>
      {playlist ? playlist.map((item, idx) => (
        <div key={idx} className='playlist-card'>
          <p>{item.playlist.name}</p>
          <Link to={`/recommend/playlist/${item.playlist.id}/${playlistId}`}><img src={item.playlist.images[0].url}/></Link>
        </div>
      )) : null}
    </div>
  )
}

export default User