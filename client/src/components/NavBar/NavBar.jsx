import React, { useEffect, useState } from 'react'
import { logoutSpotify } from 'utils/spotify'
import { Link, useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Image from 'utils/image'
import './NavBar.css'

function NavBar () {
  const [anchorEl, setAnchorEl] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const image = new Image()
  const navigate = useNavigate()

  let profilePicture

  useEffect(() => {
    const getProfileImage = async () => {
      const { data } = await image.getProfilePicture()
      if (data !== null) {
        setAvatar(data)
      }
    }
    getProfileImage()
  }, [])

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  if (avatar === null) {
    profilePicture = <img className='avatar' src={require('img/blueflower.jpeg')} onClick={handleClick}/>
  } else {
    profilePicture = <img className='avatar' src={avatar} alt="profile picture" onClick={handleClick}/>
  }

  return (
    <div className="nav-bar">
      <Link to="/"><img src={require('img/logo.png')} className='logo'/></Link>
      {profilePicture}
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
        <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
        <MenuItem onClick={logoutSpotify}>Logout Spotify</MenuItem>
      </Menu>
    </div>
  )
}

export default NavBar
