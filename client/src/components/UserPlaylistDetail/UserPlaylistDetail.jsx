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
  const {similarityMethod, originalPlaylistId, user, vector, userVector } = location?.state
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
    <div className="user-playlist-detail">
      <NavBar />
      <div className="content">
        {userPlaylist && !isLoading ? 
          <>
            <div className="header">
              <img src={userPlaylist.images[0].url} alt="Playlist Cover" />
              <div className="playlist-header-info">
                <p>PLAYLIST</p>
                <h2>{userPlaylist.name}</h2>
                <p>Owner: {userPlaylist.owner.display_name}</p>
                <div className="buttons">
                  <button onClick={() => {
                    setPopupIsOpen(true)
                    setUserTrack({ vector: userVector, name: userPlaylist.name})
                  }} className='view-features'>View Audio Features</button>
                  {isFollowing ? <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(user, setIsFollowing)}>Unfollow {user.username}</button> : <button className='follow' onClick={() => follower.handleOnClickFollow(user, setIsFollowing)}>Follow {user.username}</button>}
                </div>
              </div>
            </div>
            <div className="playlist-detail-content">
              <div className="right">
                <div className="track-header">
                  <span className="num">#</span>
                  <span className="title">Title</span>
                  <span className="similarity">Similarity</span>
                  <span className="preview">Preview</span>
                </div>
                <hr></hr>
                <div className="tracks">
                  <UserTrackContainer 
                    tracks={userPlaylist.tracks.items} 
                    addPlaylist={true} 
                    playlistId={playlistId}
                    originalPlaylistId={originalPlaylistId}
                    vector={vector}
                    similarityMethod={similarityMethod}
                    setPopupIsOpen={setPopupIsOpen}
                    setUserTrack={setUserTrack}
                  />
                </div>
              </div>
            </div>
          </>
        : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
      {popupIsOpen && userTrack && 
        <ChartPopup 
          setPopupIsOpen={setPopupIsOpen} 
          trackVector={vector} 
          userTrack={userTrack}
          playlistName={playlist?.name}
        />
      }
    </div>
  )
}

export default UserPlaylistDetail