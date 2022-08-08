import Comment from 'components/Comment/Comment'
import React, { useEffect, useState } from 'react'
import { getComments, postComment } from 'utils/comment'
import './CommentContainer.css'

function CommentContainer ({
  otherUserId,
  playlistId
}) {
  const [comment, setComment] = useState('')
  const [playlistComments, setPlaylistComments] = useState(null)

  useEffect(() => {
    const getAllComments = async () => {
      const { data } = await getComments(otherUserId, playlistId)
      setPlaylistComments(data)
    }
    getAllComments()
  }, [])

  const handleCommentOnClick = async () => {
    await postComment(comment, Date.now(), otherUserId, playlistId)
    setComment('')
  }

  return (
    <div className="comment-container">
      <div className="post-comment">
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}placeholder='Add a comment...'/>
        <button onClick={handleCommentOnClick}>Comment</button>
      </div>
      <div className="user-comments">
        {playlistComments?.map((item, idx) => (
          <Comment key={idx} comment={item}/>
        ))}
      </div>
    </div>
  )
}

export default CommentContainer
