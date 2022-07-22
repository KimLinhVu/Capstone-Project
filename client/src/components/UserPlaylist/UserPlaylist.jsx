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
  similarityMethod
}) {
  const [isFollowing, setIsFollowing] = useState()

  const data = {
    similarityMethod: similarityMethod,
    originalPlaylistId: playlistId
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
      {isFollowing ? <button className='unfollow' onClick={handleOnClickUnfollow}>Unfollow User</button> : <button className='follow' onClick={handleOnClickFollow}>Follow User</button>}
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