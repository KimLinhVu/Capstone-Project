import React, { useRef, useEffect, useState } from 'react'
import './TrackContainer.css'
import Track from 'components/Track/Track'
import ReactLoading from 'react-loading'

function TrackContainer ({
  tracks,
  isLoading
}) {
  const [displayTracks, setDisplayTracks] = useState([])
  const [numTracks, setNumTracks] = useState(10)
  const containerRef = useRef()

  useEffect(() => {
    setDisplayTracks(tracks?.slice(0, numTracks))
  }, [numTracks, tracks])

  const handleOnScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current

      /* when user scrolls to bottom of div */
      if (scrollTop + clientHeight >= (scrollHeight - 0.5)) {
        setNumTracks(numTracks + 10)
      }
    }
  }

  return (
    <div className='track-container'
      onScroll={handleOnScroll}
      ref={containerRef}
    >
      <div className="tracks">
        {!isLoading
          ? displayTracks?.map((item, idx) => (
          <Track
            key={idx}
            trackNumber={idx}
            track={item.track}
          />
          ))
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default TrackContainer
