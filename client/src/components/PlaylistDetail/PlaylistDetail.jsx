import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from '../../utils/spotify'
import { removePlaylistFromProfile } from '../../utils/playlist'
import TrackContainer from '../TrackContainer/TrackContainer'
import { Link, useNavigate } from 'react-router-dom'

function PlaylistDetail() {
  const [isLoading, setIsLoading] = useState(true)
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()

  let navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
      setIsLoading(false)
    }
    fetchPlaylist()
  }, [])

  const removePlaylist = async () => {
    try {
      navigate('/')
      await removePlaylistFromProfile(playlist.id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="playlist-detail">
      {!isLoading && playlist ? 
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