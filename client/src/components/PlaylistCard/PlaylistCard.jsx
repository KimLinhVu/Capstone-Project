import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiFillCloseCircle } from 'react-icons/ai'
import { removePlaylistFromProfile, addFavoritePlaylist, removeFavoritePlaylist } from 'utils/playlist'
import { Tooltip } from '@mui/material'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import './PlaylistCard.css'

function PlaylistCard ({
  playlist,
  setIsLoading,
  refresh,
  setRefresh,
  favorite
}) {
  const [active, setActive] = useState('')
  let favoriteIcon

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

  if (favorite) {
    favoriteIcon = <MdOutlineFavorite size={30} className={'favorite-icon active'} onClick={handleRemoveFavorite}/>
  } else {
    favoriteIcon = <MdOutlineFavoriteBorder size={30} className={`favorite-icon ${active}`} onClick={handleAddFavorite}/>
  }

  return (
    <div className='playlist-card' onMouseEnter={() => setActive('active')} onMouseLeave={() => setActive('')} >
      <Tooltip title='Remove Playlist'>
        <AiFillCloseCircle size={35} className={`playlist-close-btn ${active}`} onClick={handleCloseOnClick}/>
      </Tooltip>
      <Link to={`playlist/${playlist.id}`}><img src={playlist.images[0].url} alt="Playlist Cover"/></Link>
      <span className='title'>{playlist.name}</span>
      {favoriteIcon}
    </div>
  )
}

export default PlaylistCard
