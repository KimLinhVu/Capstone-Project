import React from 'react'
import { useState, useEffect } from 'react'
import { addTrackToPlaylist, getTrackAudioFeatures } from 'utils/spotify'
import { convertObjectToVector, calculateTrackSimilarity } from 'utils/similarity'
import { getPlaylistTrackVector } from 'utils/playlist'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle } from "react-icons/ai";
import './Track.css'

function Track({
  track,
  trackNumber,
  addPlaylist,
  playlistId
}) {
  const [similarity, setSimilarity] = useState(null)

  useEffect(() => {
    const getTrackFeatures = async () => {
      if (addPlaylist) {
        /* fetches playlist track vector */
        const result = await getPlaylistTrackVector(playlistId)
        const vector = convertObjectToVector(result.data)
        /* call spotify one track audio feature endpoint with track id */
        const { data } = await getTrackAudioFeatures(track.id)
        let tempTrackVector = {
          acousticness: 0,
          danceability: 0,
          energy: 0,
          instrumentalness: 0,
          key: 0,
          liveness: 0,
          loudness: 0,
          mode: 0,
          speechiness: 0,
          tempo: 0,
          time_signature: 0,
          valence: 0
        }
        Object.keys(tempTrackVector).forEach(key => {
          tempTrackVector[key] = data[key]
        })
        const userVector = convertObjectToVector(tempTrackVector)

        const similarity = calculateTrackSimilarity(vector, userVector)
        setSimilarity(similarity.toFixed(2))
        
      }
    }
    getTrackFeatures()
  }, [])

  const addTrack = async () => {
    const res = await addTrackToPlaylist(playlistId, track.uri)
    /* sends success or error toast */
    if (res.status === 201) {
      notifySuccess('Track added successfully')
    } else {
      notifyError('Error adding track')
    }
  }

  const convertDuration = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  
  return (
    <div className="track">
      <div className="track-left">
        <span className='num'>{trackNumber + 1}</span>
        <img src={track.album.images[0].url} alt="Track Image"/>
        <div className="info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <div className="track-right">
        <span className="time">{convertDuration(track.duration_ms)}</span>
      </div>
      {addPlaylist ? 
      <>
        <button onClick={addTrack}><AiFillPlusCircle id='add'/></button>
        <p>Similarity Score: {similarity}</p>
      </> : null}
    </div>
  )
}

export default Track