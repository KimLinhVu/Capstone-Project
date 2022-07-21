import React from 'react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutSpotify } from 'utils/spotify'
import { getUserProfile } from 'utils/users'
import { MdLocationOn } from 'react-icons/md'
import { FaSpotify } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './ProfileCard.css'

function ProfileCard({
  spotifyProfile,
  profile
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const uploadedImage = useRef(null)
  const imageUploader = useRef(null)
  const navigate = useNavigate()
  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='profile-card'>
      {profile && (
        <>
          {spotifyProfile.images.length > 0 ? <img className='profile-picture' src={spotifyProfile.images[0].url} alt="Profile Avatar" /> : null}
          <div className="user-info">
            <div className="header">
              <h1 className='username'>{profile.username}</h1>
              <Tooltip title="Settings">
                <IoMdSettings  
                  className='settings' 
                  size={30}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={() => navigate('/login')}>Logout</MenuItem>
                <MenuItem onClick={logoutSpotify}>Logout Spotify</MenuItem>
                <MenuItem onClick={handleClose}>Change Settings</MenuItem>
              </Menu>
            </div>
            <div className="location">
              <MdLocationOn className='icon' size={25}/>
              <p className='address'>{profile.location.formatted_address}</p>
            </div>
          </div>
          <hr />
          <div className="spotify-info">
            <h2>Spotify </h2>
            <div className="spotify-info-content">
              <div className="spotify-user">
                <FaSpotify size={25}/>
                <p className="spotify-name">{spotifyProfile.display_name}</p>
              </div>
              <p className='email'>{spotifyProfile.email}</p>
              <p className='followers'>{spotifyProfile.followers.total} Followers</p>
            </div>
          </div>
          <a className='spotify-profile-btn' href={spotifyProfile.external_urls.spotify} target="_blank" rel="noreferrer">See Spotify Profile</a>
        </>
      )}
    </div>
  )
}

export default ProfileCard