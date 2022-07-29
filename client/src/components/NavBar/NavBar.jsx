import React from 'react'
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import './NavBar.css'

function NavBar() {
  return (
    <div className="nav-bar">
      <div className="tabs">
        <Link to='/'><span>Home</span></Link>
      </div>
      <div className="menu">
        {/* add dropdown menu to logout or go back to homepage */}
        <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" />
      </div>
    </div>
  )
}

export default NavBar