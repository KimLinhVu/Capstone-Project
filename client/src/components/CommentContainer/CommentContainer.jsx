import Comment from 'components/Comment/Comment'
import React, { useEffect, useRef, useState } from 'react'
import { getComments, postComment, removeComment } from 'utils/comment'
import Image from 'utils/image'
import ReactLoading from 'react-loading'
import './CommentContainer.css'

function CommentContainer ({
  userId,
  otherUserId,
  playlistId,
  setPopupIsOpen,
  setUserId
}) {
  const [comment, setComment] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [playlistComments, setPlaylistComments] = useState(null)
  const [displayComments, setDisplayComments] = useState([])
  const [numComments, setNumComments] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCommentButton, setShowCommentButton] = useState(false)
  const [sortPopular, setSortPopular] = useState(false)
  const containerRef = useRef()

  let avatar

  useEffect(() => {
    const getAllComments = async () => {
      setIsLoading(true)
      const { data } = await getComments(otherUserId, playlistId)

      let sortComments
      if (sortPopular) {
        sortComments = data.sort((a, b) => {
          return b.likes - a.likes
        })
      } else {
        sortComments = data.sort((a, b) => {
          const aDate = Number(new Date(a.createdAt))
          const bDate = Number(new Date(b.createdAt))
          return bDate - aDate
        })
      }

      setPlaylistComments(sortComments)
      setDisplayComments(sortComments.slice(0, numComments))
      setIsLoading(false)
    }
    const getProfileImage = async () => {
      const { data } = await Image.getProfilePicture()
      if (data !== null) {
        setProfilePicture(data)
      }
    }
    getProfileImage()
    getAllComments()
  }, [refresh, sortPopular])

  useEffect(() => {
    setDisplayComments(playlistComments?.slice(0, numComments))
  }, [numComments])

  const handleCommentOnClick = async () => {
    await postComment(comment, Date.now(), otherUserId, playlistId)
    setComment('')
    setRefresh(!refresh)
    setShowCommentButton(false)
  }

  const handleRemoveComment = async (commentId) => {
    await removeComment(commentId)
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

  if (profilePicture === null) {
    avatar = <img className='avatar' src={require('img/blueflower.jpeg')}/>
  } else {
    avatar = <img className='avatar' src={profilePicture} alt="profile picture"/>
  }

  return (
    <div className="comment-container"
      onScroll={handleOnScroll}
      ref={containerRef}
    >
      <div className="comment-top">
        <p className='comment-head'>{playlistComments?.length} {playlistComments?.length === 1 ? 'Comment' : 'Comments' }</p>
        {sortPopular ? <button className='sort-btn' onClick={() => setSortPopular(false)}>Sort newset first</button> : <button className='sort-btn' onClick={() => setSortPopular(true)}>Sort top comments</button>}
      </div>
      <div className="post-comment">
        <div className="input">
          {avatar}
          <textarea type="text" className='comment-input' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a comment...' onFocus={() => setShowCommentButton(true)}/>
        </div>
        {showCommentButton && (
          <div className='comment-buttons'>
            <button className='cancel-btn' onClick={() => setShowCommentButton(false)}>Cancel</button>
            <button disabled={comment === ''} className={comment === '' ? 'comment-btn inactive' : 'comment-btn'} onClick={handleCommentOnClick}>Comment</button>
          </div>
        )}
      </div>
      <div className="user-comments">
        {!isLoading
          ? displayComments?.map((item, idx) => (
          <Comment
            key={idx}
            comment={item}
            userId={userId}
            removeComment={handleRemoveComment}
            setPopupIsOpen={setPopupIsOpen}
            setUserId={setUserId}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          ))
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default CommentContainer
