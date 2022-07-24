import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from 'utils/spotify'
import UserTrackContainer from 'components/UserTrackContainer/UserTrackContainer'
import NavBar from 'components/NavBar/NavBar'
import ReactLoading from 'react-loading'
import Follower from 'utils/follower'
import LineChart from 'components/LineChart/LineChart'
import ChartPopup from 'components/ChartPopup/ChartPopup'
import './UserPlaylistDetail.css'

function UserPlaylistDetail() {
  const [userPlaylist, setUserPlaylist] = useState(null)
  const [userTrack, setUserTrack] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [popupIsOpen, setPopupIsOpen] = useState(false)
  const { playlistId } = useParams()
  const location = useLocation()
  const {similarityMethod, originalPlaylistId, user, vector, userVector } = location.state
  const follower = new Follower()

  useEffect(() => {
    /* get following list of current user */
    const isUserFollowing = async () => {
      setIsLoading(true)
      follower.isUserFollowing(user, setIsFollowing)
      setIsLoading(false)
    }
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setUserPlaylist(data)

      const res = await getPlaylistDetail(originalPlaylistId)
      setPlaylist(res.data)
      
    }
    isUserFollowing()
    fetchPlaylist()
  }, [])

  /* prevent scrolling when popup is open */
  useEffect(() => {
    if (popupIsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [popupIsOpen])

  return (
    <><NavBar />
    <div className="user-playlist-detail">
      {playlist ? 
        <div>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Cover" />
            </div>
          </div>
          {isFollowing ? <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(user, setIsFollowing)}>Unfollow {user.username}</button> : <button className='follow' onClick={() => follower.handleOnClickFollow(user, setIsFollowing)}>Follow {user.username}</button>}
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
        </div>
      : null}
    </div>
  )
}

export default UserPlaylistDetail