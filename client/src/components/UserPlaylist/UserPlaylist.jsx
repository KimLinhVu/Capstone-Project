import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addUserFollowing, removeUserFollowing, addUserFollower, removeUserFollower } from 'utils/users'
import './UserPlaylist.css'

function UserPlaylist({
  user,
  following,
  playlist,
  similarity,
  playlistId,
  similarityMethod,
  vector,
  userVector
}) {
  const [isFollowing, setIsFollowing] = useState()

  const data = {
    similarityMethod: similarityMethod,
    originalPlaylistId: playlistId,
    user: user,
    vector: vector,
    userVector: userVector
  }

  useEffect(() => {
    /* check to see if current user is already following user */
    const found = following.some(obj => obj.userId === user._id)
    if (found) {
      setIsFollowing(true)
    } else {
      setIsFollowing(false)
    }
  }, [])

  const handleOnClickFollow = async () => {
    await addUserFollowing(user._id)
    await addUserFollower(user._id)
    setIsFollowing(!isFollowing)
  }

  const handleOnClickUnfollow = async () => {
    await removeUserFollowing(user._id)
    await removeUserFollower(user._id)
    setIsFollowing(!isFollowing)
  }

  return (
    <Link to={`/user/${playlist.id}`} state={data} style={{textDecoration: 'none'}}><div className='user-playlist'>
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