import AddedTrack from 'components/AddedTrack/AddedTrack'
import React, { useEffect, useState } from 'react'
import { getAddedTrackRecords, getFollowingAddedTrackRecords } from 'utils/addedTrack'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import ReactLoading from 'react-loading'
import './RecentlyAddedView.css'

function RecentlyAddedView ({
  setPopupIsOpen,
  setUserPopupId
}) {
  const [addedTracks, setAddedTracks] = useState(null)
  const [filterSimilarity, setFilterSimilarity] = useState(false)
  const [displayAddedTracks, setDisplayAddedTracks] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [showFollowing, setShowFollowing] = useState(false)
  const [followingAddedTracks, setFollowingAddedTracks] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  let addedTrackCards
  let filterSimilarityButton
  let showFollowingButton

  useEffect(() => {
    const getAddedTracks = async () => {
      setIsLoading(true)
      const { data } = await getAddedTrackRecords()

      /* sort tracks by similarityScore */
      const sorted = data.sort((a, b) => b.similarityScore - a.similarityScore)

      setAddedTracks(sorted)
      setDisplayAddedTracks(sorted)

      setIsLoading(false)
    }
    const getFollowingTracks = async () => {
      const { data } = await getFollowingAddedTrackRecords()

      /* sort tracks by similarityScore */
      const sorted = data.flat().sort((a, b) => b.similarityScore - a.similarityScore)
      setFollowingAddedTracks(sorted)
    }
    getFollowingTracks()
    getAddedTracks()
  }, [])

  useEffect(() => {
    if (showFollowing) {
      const newArray = followingAddedTracks?.filter(item => item.username.toLowerCase().includes(userSearch.toLowerCase()))
      setDisplayAddedTracks(newArray)
    } else {
      const newArray = addedTracks?.filter(item => item.username.toLowerCase().includes(userSearch.toLowerCase()))
      setDisplayAddedTracks(newArray)
    }
  }, [userSearch])

  useEffect(() => {
    if (displayAddedTracks) {
      const tempTracks = displayAddedTracks.slice().reverse()
      setDisplayAddedTracks(tempTracks)
    }
  }, [filterSimilarity])

  if (displayAddedTracks?.length !== 0 && displayAddedTracks) {
    addedTrackCards = displayAddedTracks?.map((item, idx) => (
      <AddedTrack
        key={idx}
        track={item.track}
        playlist={item.playlist}
        similarityScore={item.similarityScore}
        ownUsername={item.ownUsername}
        otherUserId={item.otherUserId}
        username={item.username}
        addedAt={item.addedAt}
        setPopupIsOpen={setPopupIsOpen}
        setUserPopupId={setUserPopupId}
      />
    ))
  } else {
    addedTrackCards = <p className='no-tracks'>No tracks found</p>
  }

  if (filterSimilarity) {
    filterSimilarityButton = <IoMdArrowDropup className='filter' onClick={() => setFilterSimilarity(false)}/>
  } else {
    filterSimilarityButton = <IoMdArrowDropdown className='filter' onClick={() => setFilterSimilarity(true)}/>
  }

  if (showFollowing) {
    showFollowingButton = <button onClick={() => {
      setDisplayAddedTracks(addedTracks)
      setShowFollowing(false)
      setUserSearch('')
    }} className='added-track-btn'>See My Added Tracks</button>
  } else {
    showFollowingButton = <button onClick={() => {
      setDisplayAddedTracks(followingAddedTracks)
      setShowFollowing(true)
      setUserSearch('')
    }} className='added-track-btn' >See Following Added Tracks</button>
  }

  return (
    <div className="recently-added-view">
      <div className="header">
        <input className='added-track-search' type="text" placeholder='Search Users' value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
        {followingAddedTracks && showFollowingButton}
      </div>
      <div className="added-track-header">
        <span className="user">User</span>
        <span className="track-info">Track</span>
        <span className='playlist'>Playlist Added To</span>
        <div className="similarity-container">
          <span className="similarity">Similarity</span>
          {filterSimilarityButton}
        </div>
        <span className="date">Date</span>
      </div>
      <hr></hr>
      <div className="added-track-container">
        {!isLoading ? addedTrackCards : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
      <p className='expire'>Records will expire after 7 days</p>
    </div>
  )
}

export default RecentlyAddedView
