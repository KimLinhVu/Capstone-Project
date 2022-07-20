import React, { useState, useEffect } from 'react'
import { accessToken, getCurrentUserProfile } from 'utils/spotify'
import { getPlaylists, getCurrentPlaylists, sortOptionsTracks } from 'utils/playlist'
import PlaylistView from '../PlaylistView/PlaylistView'
import FavoriteView from '../FavoriteView/FavoriteView'
import ProfileCard from '../ProfileCard/ProfileCard'
import './Dashboard.css'

function Dashboard() {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [spotifyProfile, setSpotifyProfile] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [displayPlaylist, setDisplayPlaylist] = useState([])
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState(null)
  const [selected, setSelected] = useState("Add A Playlist")
  const [playlistSearch, setPlaylistSearch] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [playlistShow, setPlaylistShow] = useState(true)
  const [favoriteShow, setFavoriteShow] = useState(false)
  
  /* get value of tokens out of the URL */
  useEffect(() => {
    setSpotifyToken(accessToken)
    const fetchUserSpotifyProfile = async () => {
      const { data } = await getCurrentUserProfile()
      setSpotifyProfile(data)
    }
    if (accessToken) {
      fetchUserSpotifyProfile()
    }
  }, [])

  useEffect(() => {
    const addUserPlaylist = async () => {      
      // /* get user's profile */
      const prof = await getCurrentUserProfile()

      /* retrieve playlist that belongs to user and store in playlist state */
      const result = await getPlaylists(prof.data.id)
      const options = convertToOptionsArray(result.data)
      sortOptionsTracks(options)
      setPlaylist(options)

      /* retrieve playlists that spotify user has added to their profile */
      const currentResult = await getCurrentPlaylists(prof.data.id)

      /* sort playlists alphabetically */
      currentResult.data.sort((a, b) => {
        if(a.playlist.name.toLowerCase() < b.playlist.name.toLowerCase()) { return -1; }
        if(a.playlist.name.toLowerCase() > b.playlist.name.toLowerCase()) { return 1; }
        return 0;
      })
      setCurrentPlaylist(currentResult.data)
      setDisplayPlaylist(currentResult.data)
    }
    if (accessToken) {
      addUserPlaylist()
    }
    
  }, [currentAddPlaylist, refresh])

  useEffect(() => {
    /* displays playlists included in search input */
    const newArray = currentPlaylist?.filter(item => { return item.playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()) })
    setDisplayPlaylist(newArray)
  }, [playlistSearch])

  const convertToOptionsArray = (playlist) => {
    const newArray = []
    playlist?.forEach(item => {
      newArray.push({ key: item.playlist.id, value: item, label: item.playlist.name })
    })
    return newArray
  }

  return (
    <div className="dashboard">
      {spotifyToken ? (
      <>
        <div className="carousel">
          {/* Background Image */}
        </div>
        {spotifyProfile && 
          <ProfileCard spotifyProfile={spotifyProfile} spotifyToken={spotifyToken}/>
        }
        <div className="dashboard-right">
          <div className="nav">
            <div className="links">
              <button onClick={() => {
                setPlaylistShow(true)
                setFavoriteShow(false)
              }} className={`${playlistShow ? 'tab-show' : ''}`}>Playlists</button>
              <button onClick={() =>{
                setPlaylistShow(false)
                setFavoriteShow(true)
              }} className={`${favoriteShow ? 'tab-show' : ''}`}>Favorites</button>
              <button>Followers</button>
            </div>
            <hr />
          </div>
          <div className={`playlist-tab ${playlistShow ? 'show' : ''}`}>
            <PlaylistView
              playlist={playlist}
              selected={selected}
              setSelected={setSelected}
              setCurrentAddPlaylist={setCurrentAddPlaylist}
              currentAddPlaylist={currentAddPlaylist}
              playlistSearch={playlistSearch}
              setPlaylistSearch={setPlaylistSearch}
              displayPlaylist={displayPlaylist}
              setPlaylist={setPlaylist}
              spotifyName={spotifyProfile?.display_name}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
          <div className={`favorites-tab ${favoriteShow ? 'show' : ''}`}>
            {spotifyProfile && (
              <FavoriteView
                refresh={refresh}
                setRefresh={setRefresh}
                spotifyProfile={spotifyProfile}
              />
            )}
          </div>
        </div>
      </>)
       : <a className="App-link" href="http://localhost:8888/spotify/login/">Log Into Spotify</a>}
    </div>
  )
}

export default Dashboard