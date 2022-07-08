import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'

function Dashboard({
  clearToken
}) {

  const handleOnClickLoginSpotify = async () => {
    try {
      const data = await axios.get('http://localhost:3001/spotify/login')
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div id="login">
        <h1>First, log in to spotify</h1>
        <button onClick={handleOnClickLoginSpotify}>Sign Into Spotify Account</button>
      </div>
      <button className="logout" onClick={clearToken}>Log Out</button>
    </div>
  )
}

export default Dashboard