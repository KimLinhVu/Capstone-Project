import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getPlaylistDetail, getTrackAudioFeatures } from '../../utils/spotify'
import { removePlaylistFromProfile, addTrackVector } from '../../utils/playlist'
import TrackContainer from '../TrackContainer/TrackContainer'
import { Link, useNavigate } from 'react-router-dom'

function PlaylistDetail() {
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()

  let navigate = useNavigate()
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
    }
    fetchPlaylist()
  }, [])

  const removePlaylist = () => {
    try {
      removePlaylistFromProfile(playlist.id)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="playlist-detail">
      {playlist ? 
        <>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Image" />
            </div>
          </div>
          <div className="buttons">
            <Link to={`/recommend/${playlist.id}`}><button className='recommend'>Recommend Me</button></Link>
            <button className='remove-playlist' onClick={removePlaylist}>Remove Playlist</button>
          </div>
          <div className="tracks">
            <TrackContainer tracks={playlist.tracks.items}/>
          </div>
        </>
      : null}
    </div>
  )
}

export default PlaylistDetail