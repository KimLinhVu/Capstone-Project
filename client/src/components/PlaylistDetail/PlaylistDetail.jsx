import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlaylistDetail } from 'utils/spotify'
import NavBar from 'components/NavBar/NavBar'
import GenreContainer from 'components/GenreContainer/GenreContainer'
import Track from 'utils/tracks'
import TrackContainer from 'components/TrackContainer/TrackContainer'
import ReactLoading from 'react-loading'
import './PlaylistDetail.css'
import { addTrackVector, saveSimilarityScores } from 'utils/playlist'
import { ToastContainer } from 'react-toastify'
import { notifyError, notifySuccess } from 'utils/toast'

function PlaylistDetail () {
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tracks, setTracks] = useState(null)
  const [resyncIsLoading, setResyncIsLoading] = useState(false)
  const { playlistId } = useParams()

  useEffect(() => {
    const fetchPlaylistInformation = async () => {
      setIsLoading(true)

      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)

      const allTracks = await Track.getAllPlaylistTracks(playlistId)
      setTracks(allTracks)

      setIsLoading(false)
    }
    fetchPlaylistInformation()
  }, [])

  const handleOnClickResync = async () => {
    setResyncIsLoading(true)

    /* recalculate track vector and similarity scores */
    const trackVector = await Track.createTrackVector(playlistId, setPlaylist)

    /* save trackvector and recalculate similarity scores between all playlists */
    const trackRes = await addTrackVector(playlistId, trackVector)
    const similarityRes = await saveSimilarityScores(playlistId, trackVector)
    if (trackRes.status === 200 && similarityRes.status === 200) {
      notifySuccess('Playlist resynced successfully')
    } else {
      notifyError('Error resyncing playlist')
    }

    setResyncIsLoading(false)
  }

  return (
    <div className="playlist-detail">
      <NavBar />
      {playlist
        ? <div>
          <div className='header'>
            <img src={playlist.images[0].url} alt="Playlist Image" />
            <div className="playlist-header-info">
              <p>PLAYLIST</p>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
              <div className="buttons">
                <Link to={`/recommend/${playlist.id}`}><button className='recommend-btn'>recommend me</button></Link>
                <button className={resyncIsLoading ? 'resync disabled' : 'resync'} onClick={handleOnClickResync} disabled={resyncIsLoading}>resync playlist</button>
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
      </div>
        : <ReactLoading color='#B1A8A6' type='spin' className='playlist-loading'/>}
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default PlaylistDetail
