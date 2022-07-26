import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPlaylistDetail } from 'utils/spotify'
import { removePlaylistFromProfile } from 'utils/playlist'
import NavBar from 'components/NavBar/NavBar'
import GenreContainer from 'components/GenreContainer/GenreContainer'
import Tracks from 'utils/tracks'
import TrackContainer from 'components/TrackContainer/TrackContainer'
import ReactLoading from 'react-loading'
import './PlaylistDetail.css'

function PlaylistDetail () {
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tracks, setTracks] = useState(null)
  const { playlistId } = useParams()
  const track = new Tracks()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlaylistInformation = async () => {
      setIsLoading(true)

      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)

      const allTracks = await track.getAllPlaylistTracks(playlistId)
      setTracks(allTracks)

      setIsLoading(false)
    }
    fetchPlaylistInformation()
  }, [])

  return (
    <div className="playlist-detail">
      <NavBar />
      {playlist
        ? <>
          <div className='header'>
            <img src={playlist.images[0].url} alt="Playlist Image" />
            <div className="playlist-header-info">
              <p>PLAYLIST</p>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
              <div className="buttons">
                <Link to={`/recommend/${playlist.id}`}><button className='recommend-btn'>recommend me</button></Link>
              </div>
            </div>
          </div>
          <div className='playlist-detail-content'>
            <div className="left">
              <div className="details">
                <p><span>Owner</span> {playlist.owner.display_name}</p>
                <p><span>Followers</span> {playlist.followers.total}</p>
                <p><span>Privacy</span> {playlist.public ? 'public' : 'private'}</p>
                <p><span>Songs</span> {playlist.tracks.total}</p>
              </div>
            </div>
            <div className="right">
              <GenreContainer tracks={playlist.tracks.items}/>
              <TrackContainer
                tracks={tracks}
                isLoading={isLoading}
              />
            </div>
          </div>
      </>
        : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
  </div>
  )
}

export default PlaylistDetail
