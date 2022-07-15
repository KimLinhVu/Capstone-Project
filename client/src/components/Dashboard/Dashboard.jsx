import React, { useState, useEffect } from 'react'
import { accessToken, logout, getCurrentUserProfile, getTracksAudioFeatures, getPlaylistDetail } from '../../utils/spotify'
import { getPlaylists, getCurrentPlaylists, addPlaylistToProfile, addTrackVector } from '../../utils/playlist'
import Dropdown from '../Dropdown/Dropdown'
import Playlist from '../Playlist/Playlist'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({
  clearToken
}) {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [displayPlaylist, setDisplayPlaylist] = useState([])
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState([])
  const [selected, setSelected] = useState("Select a playlist to add to your profile")
  const [isLoading, setIsLoading] = useState(false)
  const [playlistSearch, setPlaylistSearch] = useState('')

  const navigate = useNavigate()
  
  /* get value of tokens out of the URL */
  useEffect(() => {
    setSpotifyToken(accessToken)
    const fetchUserProfile = async () => {
      const { data } = await getCurrentUserProfile()
      setProfile(data)
    }
    if (accessToken) {
      fetchUserProfile()
    }
  }, [])

  useEffect(() => {
    const addUserPlaylist = async () => {      
      // /* get user's profile */
      const prof = await getCurrentUserProfile()

      /* retrieve playlist that belongs to user and store in playlist state */
      const result = await getPlaylists(prof.data.id)
      const options = convertToOptionsArray(result.data)
      setPlaylist(options)

      /* retrieve playlists that spotify user has added to their profile */
      const currentResult = await getCurrentPlaylists(prof.data.id)
      setCurrentPlaylist(currentResult.data)
      setDisplayPlaylist(currentResult.data)
    }
    if (accessToken) {
      addUserPlaylist()
    }
    
  }, [currentAddPlaylist])

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

  const handleAddPlaylistOnClick = () => {
    const addPlaylist = async () => {
      setIsLoading(true)
      /* calculate track vector for playlist */
      const { data } = await getPlaylistDetail(currentAddPlaylist.playlistId)
      setPlaylist(data)
      
      /* create string of track Ids to use in Spotify API */
      let trackIdArray = []
      const tracks = data.tracks.items
      tracks.forEach(item => {
        const id = item.track.id
        trackIdArray.push(id)
      })

      /* receive track audio features for each track and store in an array */
      let trackArrayLength = trackIdArray.length
      let tempTrackVector = {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        key: 0,
        liveness: 0,
        loudness: 0,
        mode: 0,
        speechiness: 0,
        tempo: 0,
        time_signature: 0,
        valence: 0
      }
      while (trackIdArray.length > 0) {
        let trackIdString = trackIdArray.splice(0, 100).join(',')
        const { data } = await getTracksAudioFeatures(trackIdString)
        // eslint-disable-next-line no-loop-func
        data.audio_features.forEach(item => {
          if (item !== null) {
            Object.keys(tempTrackVector).forEach(key => {
              tempTrackVector[key] += item[key]
            })
          } else {
            trackArrayLength -= 1
          }
        })
      }

      /* take average of all track vector quantities */
      Object.keys(tempTrackVector).forEach(key => {
        tempTrackVector[key] /= trackArrayLength
      })
      /* store track-vector in playlist database */
      await addTrackVector(currentAddPlaylist.playlistId, tempTrackVector)
      
      /* adds selected playlist to user's profile */
      await addPlaylistToProfile(currentAddPlaylist)
      setCurrentAddPlaylist(null)
      playlist.length <= 1 ? setSelected('No playlist available') : setSelected("Select a playlist to add to your profile")

      setIsLoading(false)
    }
    addPlaylist()
  }

  const clearAllTokens = () => {
    clearToken()
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard">
      {spotifyToken ? (
      <>
        {profile && (
          <div className='profile-container'>
            <h1>{profile.display_name}</h1>
            {profile.images.length > 0 ? <img className='profile-picture' src={profile.images[0].url} alt="Profile Picture"/> : null}
          </div>
        )}
        {playlist ? (
          <div>
            <Dropdown 
              options={playlist}
              selected={selected}
              setSelected={setSelected}
              setCurrentAddPlaylist={setCurrentAddPlaylist}
            />
            <button className="add-playlist" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}>Add Playlist to Profile</button>
          </div>
        ) : <h1>Loading</h1>}
        <h1>Playlist Profile</h1>
        <input type="text" placeholder='Search For A Playlist' className='playlist-searchbar' value={playlistSearch} onChange={(e) => setPlaylistSearch(e.target.value)}/>
        {displayPlaylist && !isLoading ? (
          <>
            <div className='playlist-container'>
              {displayPlaylist.length !== 0 ? displayPlaylist.map((item, idx) => (
                <Playlist key={idx} playlist={item.playlist}/>
              )) : <h2>Playlist Not Found</h2>}
            </div>
          </>
        ) : <h2>Loading</h2>}
      </>)
       : <Button className="App-link" href="http://localhost:8888/spotify/login/">Log Into Spotify</Button>}
      <Button className="logout" onClick={clearAllTokens}>Log Out</Button>
      {spotifyToken ? <Button onClick={logout}>Log Out of Spotify</Button> : null}
    </div>
  )
}

export default Dashboard