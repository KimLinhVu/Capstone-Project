import React, { useEffect, useState } from 'react'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import { addFollowerFavorite, findFollowerFavorite, removeFollowerFavorite } from 'utils/users'
import './FollowerPlaylistCard.css'

function FollowerPlaylistCard ({
  playlist,
  item
}) {
  const [favorited, setFavorited] = useState(false)
  const [refresh, setRefresh] = useState(false)
  let favoriteIcon

  useEffect(() => {
    /* find if user already favorited playlist */
    const findIfFavorited = async () => {
      const { data } = await findFollowerFavorite(item)
      setFavorited(data)
    }
    findIfFavorited()
  }, [refresh])
  const handleAddFavorite = async () => {
    await addFollowerFavorite(item)
    setRefresh(!refresh)
  }
  const handleRemoveFavorite = async () => {
    await removeFollowerFavorite(item)
    setRefresh(!refresh)
  }

  if (favorited) {
    favoriteIcon = <MdOutlineFavorite size={30} className={'follower-favorite-icon'} onClick={handleRemoveFavorite}/>
  } else {
    favoriteIcon = <MdOutlineFavoriteBorder size={30} className={'follower-favorite-icon'} onClick={handleAddFavorite}/>
  }

  return (
    <div className="playlist-card">
      <img src={playlist.images[0].url} alt="Playlist Cover" />
      <span className="title">{playlist.name}</span>
      {favoriteIcon}
    </div>
  )
}

export default FollowerPlaylistCard
