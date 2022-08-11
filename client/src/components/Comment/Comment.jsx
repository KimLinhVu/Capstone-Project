import React, { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import Image from 'utils/image'
import './Comment.css'
import { addLike, calculateCommentDate, editComment, removeLike } from 'utils/comment'
import LongMenu from 'components/LongMenu/LongMenu'
import { useNavigate } from 'react-router-dom'

function Comment ({
  userId,
  comment,
  removeComment,
  setPopupIsOpen,
  setUserId,
  refresh,
  setRefresh
}) {
  const [profilePicture, setProfilePicture] = useState(null)
  const [likedComment, setLikedComment] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [likes, setLikes] = useState(comment.likes)
  const [username, setUsername] = useState(null)
  const [date, setDate] = useState(null)
  const [edit, setEdit] = useState(false)
  const [editedComment, setEditedComment] = useState(comment.comment)
  const navigate = useNavigate()

  let likedIcon
  let commentInput

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

      /* find amount of days since comment was posted */
      const dateString = calculateCommentDate(comment.createdAt)
      setDate(dateString)
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

  const handleProfileOnClick = () => {
    /* navigate back to dashboard if owm comment */
    if (showDelete) {
      navigate('/')
    } else {
      /* show other user's profile popup */
      setUserId(comment.userId)
      setPopupIsOpen(true)
    }
  }

  const handleEditOnClick = async () => {
    await editComment(comment._id, editedComment)
    setRefresh(!refresh)
  }

  if (likedComment) {
    likedIcon = <MdOutlineFavorite size={25} className={'favorite-icon'} onClick={handleRemoveLike}/>
  } else {
    likedIcon = <MdOutlineFavoriteBorder size={25} className={'favorite-icon'} onClick={handleAddLike}/>
  }

  if (edit) {
    commentInput = <input type='text' value={editedComment} onChange={(e) => setEditedComment(e.target.value)} className='edit-input'/>
  } else {
    commentInput = comment.comment
  }

  return (
    <div className="comment">
      <img className='comment-pfp'
        src={profilePicture} alt="User pfp"
        onClick={handleProfileOnClick}
      />
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-header-left">
            <p className="username" onClick={handleProfileOnClick}>{username}</p>
            <p className="date">{date} {comment.isEdited && '(edited)'}</p>
          </div>
          <div className="comment-header-right">
            {showDelete && !edit &&
              <LongMenu
                removeComment={removeComment}
                commentId={comment._id}
                setEdit={setEdit}
              />}
          </div>
        </div>
        <p className='user-comment'>{commentInput}</p>
        {edit && (
          <div className='comment-buttons'>
          <button className='cancel-btn' onClick={() => setEdit(false)}>Cancel</button>
          <button disabled={comment === '' || editedComment === comment.comment} className={comment === '' || editedComment === comment.comment ? 'comment-btn inactive' : 'comment-btn'}onClick={handleEditOnClick}>Comment</button>
          </div>
        )}
        {!edit && <span className='likes'>{likedIcon}<p className="num_likes">{likes}</p></span>}
      </div>
    </div>
  )
}

export default Comment
