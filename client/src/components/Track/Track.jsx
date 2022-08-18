import React, { useEffect, useState } from 'react'
import { getTrackDetails, addSpotifyUri } from 'utils/shazam'
import './Track.css'

function Track ({
  track,
  trackNumber
}) {
  const [trackPreview, setTrackPreview] = useState(null)

  useEffect(() => {
    const trackId = track.id
    const trackSearchParams = track.name.concat(' ', track.artists[0].name).replaceAll(' ', '%20')
    const getPreviewUri = async () => {
      const { data } = await getTrackDetails(trackId, trackSearchParams)
      setTrackPreview(data)
    }
    const addPreviewUri = async () => {
      setTrackPreview(track.preview_url)
      await addSpotifyUri(trackId, track.preview_url)
    }
    if (track.preview_url === null) {
      getPreviewUri()
    } else {
      addPreviewUri()
    }
  }, [])
  return (
    <div className="track">
      {track && (
        <>
          <div className="track-left">
            <span className='num'>{trackNumber + 1}</span>
            <img src={track.album.images[0]?.url} alt="Track Image"/>
            <div className="info">
              <span className='title'>{track.name}</span>
              <span className='artist'>{track.artists[0].name}</span>
            </div>
          </div>
          <div className="track-right">
            <audio controls src={trackPreview}></audio>
          </div>
        </>
      )}
    </div>
  )
}

export default Track
