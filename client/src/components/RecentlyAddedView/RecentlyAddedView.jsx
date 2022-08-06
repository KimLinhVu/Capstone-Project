import TrackReceipt from 'components/TrackReceipt/TrackReceipt'
import React, { useEffect, useState } from 'react'
import { getTrackReceipts } from 'utils/trackReceipt'
import './RecentlyAddedView.css'

function RecentlyAddedView () {
  const [addedTracks, setAddedTracks] = useState(null)

  useEffect(() => {
    const getAddedTracks = async () => {
      const { data } = await getTrackReceipts()

      /* sort tracks by date */
      const sortedByDate = data.sort((a, b) => {
        const aTime = Number(new Date(a.addedAt))
        const bTime = Number(new Date(b.addedAt))
        return bTime - aTime
      })

      setAddedTracks(sortedByDate)
    }
    getAddedTracks()
  }, [])
  return (
    <div className="recently-added-view">
      <div className="search">
        <input className='receipt-search 'type="text" placeholder='Search Users'/>
      </div>
      <div className="receipt-header">
        <span className="user">User</span>
        <span className="track-info">Track</span>
        <span className='playlist'>Playlist Added To</span>
        <span className="similarity">Similarity</span>
        <span className="date">Date</span>
      </div>
      <hr></hr>
      <div className="receipt-container">
        {addedTracks
          ? addedTracks.map((item, idx) => (
            <TrackReceipt
              key={idx}
              track={item.track}
              playlist={item.playlist}
              similarityScore={item.similarityScore}
              username={item.username}
              addedAt={item.addedAt}
            />
          ))
          : <p>No recently added tracks</p>
        }
      </div>
    </div>
  )
}

export default RecentlyAddedView
