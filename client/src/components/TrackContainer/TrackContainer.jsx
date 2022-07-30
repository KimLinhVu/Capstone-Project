
import React from 'react'
import './TrackContainer.css'
import Track from 'components/Track/Track'
import ReactLoading from 'react-loading'

function TrackContainer({
  tracks,
  isLoading
}) {
  return (
    <div className='track-container'>
      <div className="tracks">
        {!isLoading ? tracks.map((item, idx) => (
          <Track 
            key={idx}
            trackNumber={idx}
            track={item.track}
          />
        )) : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default TrackContainer