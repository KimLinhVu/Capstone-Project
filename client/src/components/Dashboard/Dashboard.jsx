import React, { useState, useEffect, useRef } from 'react'
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylist } from '../../utils/spotify'
import { getPlaylists, getCurrentPlaylists, addPlaylists, addPlaylistToProfile } from '../../utils/playlist'
import styled from 'styled-components/macro'
import Dropdown from '../Dropdown/Dropdown'
import Playlist from '../Playlist/Playlist'
import 'react-dropdown/style.css'
import './Dashboard.css'

const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`

function Dashboard({
  clearToken
}) {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState(null)
  const [selected, setSelected] = useState("Select a playlist to add to your profile")
  const isMounted = useRef(false)
  
  /* get value of tokens out of the URL */
  useEffect(() => {
    setSpotifyToken(accessToken)
    const fetchUserProfile = async () => {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)
      } catch (error) {
        console.log(error)
      }
    }
    if (accessToken) {
      fetchUserProfile()
    }
  }, [])

  useEffect(() => {
    if (isMounted.current && accessToken) {
      const addUserPlaylist = async () => {
        try {
          /* get list of playlist from Spotify API */
          const { data } = await getCurrentUserPlaylist()
          const playlists = data.items
          /* get user's profile */
          const prof = await getCurrentUserProfile()
          /* add to mongo database */
          playlists?.forEach( async (item) => {
            await addPlaylists(item, prof.data.id)
          })
          /* retrieve playlist that belongs to user and store in playlist state */
          const result = await getPlaylists(prof.data.id)
          const options = convertToOptionsArray(result.data)
          setPlaylist(options)

          /* retrieve playlists that spotify user has added to their profile */
          const currentResult = await getCurrentPlaylists(prof.data.id)
          setCurrentPlaylist(currentResult.data)
        } catch (error) {
          console.log(error)
        }
      }
      addUserPlaylist()
    } else {
      isMounted.current = true
    }
  }, [currentAddPlaylist])

  const convertToOptionsArray = (playlist) => {
    const newArray = []
    playlist?.forEach(item => {
      newArray.push({ key: item.playlist.id, value: item, label: item.playlist.name })
    })
    return newArray
  }

  const handleAddPlaylistOnClick = () => {
    const addPlaylist = async () => {
      /* adds selected playlist to user's profile */
      const temp = currentAddPlaylist
      setCurrentAddPlaylist(null)
      playlist.length <= 1 ? setSelected('No playlist available') : setSelected("Select a playlist to add to your profile")
      await addPlaylistToProfile(temp)
    }
    addPlaylist()
  }

  const clearAllTokens = () => {
    clearToken()
    logout()
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
        {currentPlaylist && (
          <>
            <h1>Playlist Profile</h1>
            <div className='playlist-container'>
              {currentPlaylist.map((item, idx) => (
                <Playlist key={idx} playlist={item.playlist}/>
              ))}
            </div>
          </>
        )}
      </>)
       : <StyledLoginButton className="App-link" href="http://localhost:8888/spotify/login">Log Into Spotify</StyledLoginButton>}
      <button className="logout" onClick={clearAllTokens}>Log Out</button>
      {spotifyToken ? <button onClick={logout}>Log Out of Spotify</button> : null}
    </div>
  )
}

export default Dashboard