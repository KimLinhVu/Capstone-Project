import React, { useState, useEffect } from 'react'
import { accessToken, logout, getCurrentUserProfile } from './spotify'
import styled from 'styled-components/macro'

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
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  /* get value of tokens out of the URL */
  useEffect(() => {
    setToken(accessToken)

    const fetchData = async () => {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
    
  }, [])

  return (
    <div className="dashboard">
      {token ? (
      <>
        <h1>Logged In</h1>
        {profile && (
          <div>
            <h1>{profile.display_name}</h1>
            <p>{profile.followers.total} Followers</p>
            {profile.images.length > 0 ? <img src={profile.images[0].url} alt="Profile Picture"/> : null}
          </div>
        )}
      </>)
       : <StyledLoginButton className="App-link" href="http://localhost:8888/spotify/login">Log Into Spotify</StyledLoginButton>}
      <button className="logout" onClick={clearToken}>Log Out</button>
      {token ? <button onClick={logout}>Log Out of Spotify</button> : null}
    </div>
  )
}

export default Dashboard