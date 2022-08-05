import React, { useState } from 'react'
import { logoutSpotify } from 'utils/spotify'
import Avatar from '@mui/material/Avatar'
import { Link, useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import './NavBar.css'

function NavBar () {
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="nav-bar">
      <Link to="/"><img src={require('img/logo.png')} className='logo'/></Link>
      <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" className='avatar' onClick={handleClick}/>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
        <MenuItem onClick={logoutSpotify}>Logout Spotify</MenuItem>
        <MenuItem onClick={() => {
          logoutSpotify()
          navigate('/login')
        }}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

export default NavBar
