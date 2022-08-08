import Comment from 'components/Comment/Comment'
import React, { useEffect, useRef, useState } from 'react'
import { getComments, postComment } from 'utils/comment'
import ReactLoading from 'react-loading'
import './CommentContainer.css'

function CommentContainer ({
  otherUserId,
  playlistId
}) {
  const [comment, setComment] = useState('')
  const [playlistComments, setPlaylistComments] = useState(null)
  const [displayComments, setDisplayComments] = useState([])
  const [numComments, setNumComments] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    const getAllComments = async () => {
      setIsLoading(true)
      const { data } = await getComments(otherUserId, playlistId)

      /* sort by date */
      const sortByDate = data.sort((a, b) => {
        const aDate = Number(new Date(a.createdAt))
        const bDate = Number(new Date(b.createdAt))
        return bDate - aDate
      })
      setPlaylistComments(sortByDate)
      setDisplayComments(sortByDate.slice(0, numComments))
      setIsLoading(false)
    }
    getAllComments()
  }, [refresh])

  useEffect(() => {
    setDisplayComments(playlistComments?.slice(0, numComments))
  }, [numComments])

  const handleCommentOnClick = async () => {
    await postComment(comment, Date.now(), otherUserId, playlistId)
    setComment('')
    setRefresh(!refresh)
  }

  const handleOnScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current

      /* when user scrolls to bottom of div */
      if (scrollTop + clientHeight >= (scrollHeight - 0.5)) {
        setNumComments(numComments + 10)
      }
    }
  }

  return (
    <div className="comment-container"
      onScroll={handleOnScroll}
      ref={containerRef}
    >
      <div className="post-comment">
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}placeholder='Add a comment...'/>
        <button onClick={handleCommentOnClick}>Comment</button>
      </div>
      <div className="user-comments">
        {!isLoading
          ? displayComments?.map((item, idx) => (
          <Comment key={idx} comment={item}/>
          ))
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default CommentContainer
