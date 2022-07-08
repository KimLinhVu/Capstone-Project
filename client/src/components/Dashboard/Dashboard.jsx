import React, { useState, useEffect } from 'react'
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylist } from '../../spotify'
import { getPlaylists, getCurrentPlaylists, addPlaylists, addPlaylistToProfile } from './playlist'
import styled from 'styled-components/macro'
import Dropdown from 'react-dropdown'
import Playlist from '../Playlist/Playlist'
import 'react-dropdown/style.css'

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
    fetchUserProfile()
  }, [])

  useEffect(() => {
    const addUserPlaylist = async () => {
      try {
        /* get list of playlist from Spotify API */
        const { data } = await getCurrentUserPlaylist()
        /* get user's profile */
        const prof = await getCurrentUserProfile()
        /* add to mongo database */
        await addPlaylists(data.items, prof.data.id)
        /* retrieve playlist that belongs to user and store in playlist state */
        const result = await getPlaylists(prof.data.id)
        const options = convertToOptionsArray(result.data)
        setPlaylist(options)

        const currentResult = await getCurrentPlaylists()
        setCurrentPlaylist(currentResult.data)
        console.log(currentPlaylist)
      } catch (error) {
        console.log(error)
      }
    }
    addUserPlaylist()
  }, [currentAddPlaylist])

  const convertToOptionsArray = (playlist) => {
    const newArray = []
    for (let i = 0; i < playlist?.length; i++) {
      newArray.push({key: playlist[i].playlist.id, value: playlist[i], label: playlist[i].playlist.name})
    }
    return newArray
  }

  const handleAddPlaylistOnClick = async () => {
    /* adds a playlist to the user's profile */
    try {
      const temp = currentAddPlaylist
      setCurrentAddPlaylist(null)
      await addPlaylistToProfile(temp)
    } catch (error) {
      console.log(error)
    }
  }

  const clearAllTokens = () => {
    clearToken()
    logout()
  }

  return (
    <div className="dashboard">
      {spotifyToken ? (
      <>
        <h1>Logged In</h1>
        {profile && (
          <div>
            <h1>{profile.display_name}</h1>
            <p>id: {profile.id}</p>
            <p>{profile.followers.total} Followers</p>
            {profile.images.length > 0 ? <img src={profile.images[0].url} alt="Profile Picture"/> : null}
          </div>
        )}
        {playlist && (
          <div>
            <Dropdown 
              options={playlist} 
              onChange={(e) => setCurrentAddPlaylist(e.value)}
              placeholder="Select a playlist to add to your profile"
            />
            <button className="add-playlist" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}>Add Playlist to Profile</button>
          </div>
        )}
        {currentPlaylist && (
          <div>
            <h1>Playlist Profile</h1>
            {currentPlaylist.map((item, idx) => (
              <Playlist key={idx} playlist={item.playlist}/>
            ))}
          </div>
        )}
      </>)
       : <StyledLoginButton className="App-link" href="http://localhost:8888/spotify/login">Log Into Spotify</StyledLoginButton>}
      <button className="logout" onClick={clearAllTokens}>Log Out</button>
      {spotifyToken ? <button onClick={logout}>Log Out of Spotify</button> : null}
    </div>
  )
}

export default Dashboard