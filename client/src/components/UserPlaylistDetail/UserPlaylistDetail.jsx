import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail } from 'utils/spotify'
import TrackContainer from 'components/TrackContainer/TrackContainer'

function UserPlaylistDetal() {
  const [playlist, setPlaylist] = useState(null)
  const { playlistId, originalPlaylistId } = useParams()

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
    }
    fetchPlaylist()
  }, [])

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
          <div className="tracks">
            <TrackContainer 
              tracks={playlist.tracks.items} 
              addPlaylist={true} 
              playlistId={originalPlaylistId}
            />
          </div>
        </>
      : null}
    </div>
  )
}

export default UserPlaylistDetal