import React, { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import Image from 'utils/image'
import './Comment.css'

function Comment ({
  userId,
  comment,
  removeComment
}) {
  const [profilePicture, setProfilePicture] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    const getUserInformation = async () => {
      const { data } = await getUserProfileById(comment.userId)
      setUsername(data.username)

      const res = await Image.getUserProfilePicture(comment.userId)
      res ? setProfilePicture(res.data) : setProfilePicture('img/blueflower.jpeg')

      if (data._id === userId) {
        setShowDelete(true)
      }
    }
    getUserInformation()
  }, [])

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
        <p className="likes">Likes: {comment.likes}</p>
      </div>
    </div>
  )
}

export default Comment
