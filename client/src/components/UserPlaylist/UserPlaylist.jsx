import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './UserPlaylist.css'

function UserPlaylist({
  user,
  playlist,
  similarity,
  playlistId,
  similarityMethod
}) {
  const [isFollowing, setIsFollowing] = useState()
  let followButton;

  const data = {
    similarityMethod: similarityMethod,
    originalPlaylistId: playlistId
  }

  if (isFollowing) {
    followButton = <button className='unfollow' onClick={handleOnClickUnfollow}>Unfollow User</button>
  } else {
    followButton = <button className='follow' onClick={handleOnClickFollow}>Follow User</button>
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
    <div className='user-playlist'>
      <h2>{user.username}</h2>
      {followButton}
      {playlist ? (
        <div className='playlist-card'>
          <p>{playlist.name}</p>
          <p>Similarity Method: {similarityMethod === 0 ? 'Cosine' : 'Own'}</p>
          <p>Similarity Score: {similarity}</p>
          <Link to={`/user/${playlist.id}`} state={data}><img src={playlist.images[0].url}/></Link>
        </div>
      </div>
      <div className="right">
        <button className='similarity'>{similarity}</button>
      </div>
    </div></Link>
  )
}

export default UserPlaylist