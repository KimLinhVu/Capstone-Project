import React from 'react'
import Avatar from '@mui/material/Avatar';
import './NavBar.css'

function NavBar() {
  return (
    <div className="nav-bar">
      <div className="tabs">
        <span>Home</span>
        <span className="selectedTab">Tracks</span>
        <span>Genres</span>
        <span>Artists</span>
      </div>
      <div className="menu">
        {/* add dropdown menu to logout or go back to homepage */}
        <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" />
      </div>
    </div>
  )
}

export default NavBar