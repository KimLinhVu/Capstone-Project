import React from 'react'
import LineChart from 'components/LineChart/LineChart'
import './ChartPopup.css'

function ChartPopup({
  trackVector,
  setPopupIsOpen,
  playlistName,
  userTrack
}) {
  return (
    <div className="chart-popup">
      <div className="overlay" onClick={() => setPopupIsOpen(false)}></div>
      <div className="chart">
        <LineChart 
          trackVector={trackVector}
          userTrackVector={userTrack.vector}
          userPlaylistName={userTrack.name}
          playlistName={playlistName}
        />
      </div>
    </div>
  )
}

export default ChartPopup