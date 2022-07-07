import React, { useState, useEffect } from 'react'
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylist } from './spotify'
import axios from 'axios'
import styled from 'styled-components/macro'
import Dropdown from 'react-dropdown'
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

    const fetchUserPlaylist = async () => {
      try {
        const { data } = await getCurrentUserPlaylist()
        console.log(data.items)
        setPlaylist(data.items)

        // axios.post('http://localhost:8888/playlist/', {
        //   playlist: data.items
        // },{
        //   headers: {
        //     "x-access-token": localStorage.getItem('token')
        //   }
        // }).then(res => {
        //   console.log(res)
        // }).catch(err => {
        //   console.log(err)
        // })
      
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserProfile()
    fetchUserPlaylist()
  }, [])

  const handleAddPlaylistOnClick = () => {
    /* work on how to update an item in db */
    console.log(currentAddPlaylist)
    axios.post('http://localhost:8888/playlist/', {
      playlist: currentAddPlaylist
    },{
      headers: {
        "x-access-token": localStorage.getItem('token')
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
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
            <p>{profile.followers.total} Followers</p>
            {profile.images.length > 0 ? <img src={profile.images[0].url} alt="Profile Picture"/> : null}
          </div>
        )}
        {playlist && (
          // <div>
          //   {playlist.map(item => (
          //     <div className='playlist'>
          //       <img src={item.images[0]?.url} alt="Playlist Image"/>
          //       <p>{item.name}</p>
          //     </div>
          //   ))}
          // </div>
          <div>
            <Dropdown 
              options={playlist.map(item => ({value: item, label: item.name}))} 
              onChange={(e) => setCurrentAddPlaylist(e.value)}
              placeholder="Select a playlist to add to your profile"
            />
            <button className="add-playlist" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}>Add Playlist to Profile</button>
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