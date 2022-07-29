import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from 'utils/spotify'
import TrackContainer from 'components/TrackContainer/TrackContainer'

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
    <div className="playlist-detail">
      {similarityMethod ? <h1>{similarityMethod}</h1> : <p>No State</p>}
      {playlist ? 
        <div>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Image" />
            </div>
          </div>
          <div className="tracks">
            <TrackContainer 
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