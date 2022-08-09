import AddedTrack from 'components/AddedTrack/AddedTrack'
import React, { useEffect, useState } from 'react'
import { getAddedTrackRecords } from 'utils/addedTrack'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import './RecentlyAddedView.css'

function RecentlyAddedView ({
  setPopupIsOpen,
  setUserPopupId
}) {
  const [addedTracks, setAddedTracks] = useState(null)
  const [filterSimilarity, setFilterSimilarity] = useState(false)
  const [displayAddedTracks, setDisplayAddedTracks] = useState(null)
  const [userSearch, setUserSearch] = useState('')

  let addedTrackCards
  let filterSimilarityButton

  useEffect(() => {
    const getAddedTracks = async () => {
      const { data } = await getAddedTrackRecords()

      /* sort tracks by similarityScore */
      const sorted = data.sort((a, b) => b.similarityScore - a.similarityScore)

      setAddedTracks(sorted)
      setDisplayAddedTracks(sorted)
    }
    getAddedTracks()
  }, [])

  useEffect(() => {
    const newArray = addedTracks?.filter(item => item.username.toLowerCase().includes(userSearch.toLowerCase()))
    setDisplayAddedTracks(newArray)
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
        userId={item.otherUserId}
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

  return (
    <div className="recently-added-view">
      <div className="search">
        <input className='added-track-search 'type="text" placeholder='Search Users' value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
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
        {addedTrackCards}
      </div>
      <p className='expire'>Records will expire after 7 days</p>
    </div>
  )
}

export default RecentlyAddedView
