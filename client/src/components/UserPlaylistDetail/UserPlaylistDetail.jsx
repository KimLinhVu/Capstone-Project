import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from 'utils/spotify'
import UserTrackContainer from 'components/UserTrackContainer/UserTrackContainer'
import './UserPlaylistDetail.css'

function UserPlaylistDetail() {
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()
  const location = useLocation()
  const {similarityMethod, originalPlaylistId} = location.state

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
    }
    fetchPlaylist()
  }, [])

  return (
    <div className="user-playlist-detail">
      {playlist ? 
        <>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Cover" />
            </div>
          </div>
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
      : null}
    </div>
  )
}

export default UserPlaylistDetail