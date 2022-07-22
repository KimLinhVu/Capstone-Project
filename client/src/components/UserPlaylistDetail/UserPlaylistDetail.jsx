import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from 'utils/spotify'
import { getUserProfile, addUserFollowing, removeUserFollowing, addUserFollower, removeUserFollower } from 'utils/users'
import UserTrackContainer from 'components/UserTrackContainer/UserTrackContainer'
import ReactLoading from 'react-loading'
import './UserPlaylistDetail.css'

function UserPlaylistDetail() {
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { playlistId } = useParams()
  const location = useLocation()
  const {similarityMethod, originalPlaylistId, user } = location.state

  useEffect(() => {
    /* get following list of current user */
    const isUserFollowing = async () => {
      setIsLoading(true)

      const { data } = await getUserProfile()
      /* check to see if current user is already following user */
      const found = data.following.some(obj => obj.userId === user._id)
      if (found) {
        setIsFollowing(true)
      } else {
        setIsFollowing(false)
      }
      setIsLoading(false)
    }
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
    }
    isUserFollowing()
    fetchPlaylist()
  }, [])

  const handleOnClickFollow = async () => {
    await addUserFollowing(user._id)
    await addUserFollower(user._id)
    setIsFollowing(true)
  }

  const handleOnClickUnfollow = async () => {
    await removeUserFollowing(user._id)
    await removeUserFollower(user._id)
    setIsFollowing(false)
  }

  return (
    <div className="user-playlist-detail">
      {playlist && !isLoading ? 
        <>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Cover" />
            </div>
          </div>
          {isFollowing ? <button className='unfollow' onClick={handleOnClickUnfollow}>Unfollow {user.username}</button> : <button className='follow' onClick={handleOnClickFollow}>Follow {user.username}</button>}
          <div className="header">
            <span className="num">#</span>
            <span className="title">Title</span>
            <span className="similarity">Similarity Score</span>
            <span className="time">Time</span>
          </div>
          <hr></hr>
          <div className="tracks">
            <UserTrackContainer 
              tracks={playlist.tracks.items} 
              addPlaylist={true} 
              playlistId={playlistId}
              originalPlaylistId={originalPlaylistId}
              similarityMethod={similarityMethod}
            />
          </div>
        </>
      : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
    </div>
  )
}

export default UserPlaylistDetail