import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from '../../utils/spotify'
import { removePlaylistFromProfile } from '../../utils/playlist'
import TrackContainer from '../TrackContainer/TrackContainer'
import { Link, useNavigate } from 'react-router-dom'
import { notifyError, notifySuccess } from '../../utils/toast'
import NavBar from '../NavBar/NavBar'
import './PlaylistDetail.css'

function PlaylistDetail() {
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()

  let navigate = useNavigate()
  
  useEffect(() => {
    const fetchPlaylistInformation = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
    }
    fetchPlaylistInformation()
  }, [])

  const removePlaylist = () => {
    removePlaylistFromProfile(playlist.id)
    navigate('/')
  }

  return (
    <div className="playlist-detail">
      <NavBar />
      {playlist ? 
        <div className='playlist-detail-content'>
          <div className='playlist-card'>
            <img src={playlist.images[0].url} alt="Playlist Image" />
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
            </div>
          </div>
          <div className="buttons">
            <Link to={`/recommend/${playlist.id}`}><button className='recommend'>Recommend Me</button></Link>
            <button className='remove-playlist' onClick={removePlaylist}>Remove Playlist</button>
          </div>
          <div className="tracks">
            <TrackContainer 
              tracks={playlist.tracks.items}
              notifyError={notifyError}
              notifySuccess={notifySuccess}
            />
          </div>
        </div>
      : <h1>Loading...</h1>}
    </div>
  )
}

export default PlaylistDetail