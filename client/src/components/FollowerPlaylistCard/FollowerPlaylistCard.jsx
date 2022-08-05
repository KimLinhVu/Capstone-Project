import React, { useEffect, useState } from 'react'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import { addFollowerFavorite, findFollowerFavorite, removeFollowerFavorite } from 'utils/users'
import { useNavigate } from 'react-router-dom'
import './FollowerPlaylistCard.css'

function FollowerPlaylistCard ({
  playlist,
  item,
  user,
  profile,
  originalPlaylistId,
  vector
}) {
  const [favorited, setFavorited] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate()
  let favoriteIcon

  const data = {
    similarityMethod: profile.similarityMethod,
    originalPlaylistId,
    user,
    vector,
    userVector: item.trackVector
  }

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

  const handleOnClick = () => {
    navigate(`/user/${playlist.id}`, { state: data })
    window.location.reload()
  }

  return (
    <div className="follow-playlist-card">
      <img onClick={handleOnClick} src={playlist.images[0].url} alt="Playlist Cover" />
      <span className="title">{playlist.name}</span>
      <span className='username'>{user?.username}</span>
      {favoriteIcon}
    </div>
  )
}

export default FollowerPlaylistCard
