import React, { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import Image from 'utils/image'
import './Comment.css'
import { addLike, removeLike } from 'utils/comment'

function Comment ({
  userId,
  comment,
  removeComment
}) {
  const [profilePicture, setProfilePicture] = useState(null)
  const [likedComment, setLikedComment] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [likes, setLikes] = useState(comment.likes)
  const [username, setUsername] = useState(null)

  let likedIcon

  useEffect(() => {
    const getUserInformation = async () => {
      const { data } = await getUserProfileById(comment.userId)
      setUsername(data.username)

      const res = await Image.getUserProfilePicture(comment.userId)
      res ? setProfilePicture(res.data) : setProfilePicture('img/blueflower.jpeg')

      if (data._id === userId) {
        setShowDelete(true)
      }

      /* find if user already liked the comment */
      comment.usersLiked.forEach(user => {
        if (user.userId === userId) {
          setLikedComment(true)
        }
      })
    }
    getUserInformation()
  }, [])

  const handleAddLike = async () => {
    await addLike(comment._id)
    setLikes(likes + 1)
    setLikedComment(true)
  }

  const handleRemoveLike = async () => {
    await removeLike(comment._id)
    setLikes(likes - 1)
    setLikedComment(false)
  }

  if (likedComment) {
    likedIcon = <MdOutlineFavorite size={20} className={'favorite-icon active'} onClick={handleRemoveLike}/>
  } else {
    likedIcon = <MdOutlineFavoriteBorder size={20} className={'favorite-icon active'} onClick={handleAddLike}/>
  }

  return (
    <div className="comment">
      <img className='comment-pfp' src={profilePicture} alt="User pfp"/>
      <div className="comment-content">
        <div className="comment-header">
          <p className="username">{username}</p>
          <p className="date">{comment.createdAt}</p>
          {showDelete && <button onClick={() => removeComment(comment._id)}>Delete</button>}
        </div>
        <p className='comment'>{comment.comment}</p>
        <p className="likes">{likedIcon}{likes}</p>
      </div>
    </div>
  )
}

export default Comment
