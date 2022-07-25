import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiFillCloseCircle } from 'react-icons/ai'
import { removePlaylistFromProfile } from 'utils/playlist'
import { Tooltip } from '@mui/material'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import { addFavoritePlaylist, removeFavoritePlaylist } from 'utils/playlist'
import "./PlaylistCard.css"

function PlaylistCard({
  playlist,
  setIsLoading,
  refresh,
  setRefresh,
  favorite,
  otherUser
}) {
  const [active, setActive] = useState('')

  const handleCloseOnClick = () => {
    setIsLoading(true)
    removePlaylistFromProfile(playlist.id)
    setRefresh(!refresh)
    setIsLoading(false)
  }

  const handleAddFavorite = async () => {
    await addFavoritePlaylist(playlist.id)
    setRefresh(!refresh)
  }

  const handleRemoveFavorite = async () => {
    await removeFavoritePlaylist(playlist.id)
    setRefresh(!refresh)
  }
  
  return (
    <div className='playlist-card' onMouseEnter={() => setActive('active')} onMouseLeave={() => setActive('')} >
      {!otherUser ? 
        <Tooltip title='Remove Playlist'>
          <AiFillCloseCircle size={35} className={`playlist-close-btn ${active}`} onClick={handleCloseOnClick}/>
        </Tooltip> : null}
      <Link to={`playlist/${playlist.id}`} className={otherUser ? 'disable' : ''}><img src={playlist.images[0].url} alt="Playlist Cover" className={otherUser ? 'disable' : ''}/></Link>
      <span className='title'>{playlist.name}</span>
      {favorite ? <MdOutlineFavorite size={30} className={`favorite-icon active`} onClick={handleRemoveFavorite}/>: <MdOutlineFavoriteBorder size={30} className={`favorite-icon ${active}`} onClick={handleAddFavorite}/>}
    </div>
  )
}

export default PlaylistCard