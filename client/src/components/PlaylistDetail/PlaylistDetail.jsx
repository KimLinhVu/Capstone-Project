import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from '../../spotify'
import TrackContainer from '../TrackContainer/TrackContainer'
import axios from 'axios'

function PlaylistDetail() {
  const [isLoading, setIsLoading] = useState(true)
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()

  useEffect(() => {
    setIsLoading(true)
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
      setIsLoading(false)
    }
    fetchPlaylist()
  }, [])

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
          <div className="recommend-button">
            <button className='recommend'>Recommend Me</button>
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