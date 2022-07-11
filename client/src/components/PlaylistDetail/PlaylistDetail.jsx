import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPlaylistDetail, getTrackAudioFeatures } from '../../utils/spotify'
import { removePlaylistFromProfile, addTrackVector } from '../../utils/playlist'
import TrackContainer from '../TrackContainer/TrackContainer'
import { Link, useNavigate } from 'react-router-dom'

function PlaylistDetail() {
  const [playlist, setPlaylist] = useState(null)
  const { playlistId } = useParams()

  let navigate = useNavigate()

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setPlaylist(data)
      
      /* create string of track Ids to use in Spotify API */
      let trackIdArray = []
      const tracks = data.tracks.items
      tracks.forEach(item => {
        const id = item.track.id
        trackIdArray.push(id)
      })

      /* receive track audio features for each track and store in an array */
      const trackArrayLength = trackIdArray.length
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
      while (trackIdArray.length > 0) {
        let trackIdString = trackIdArray.splice(0, 100).join(',')
        const { data } = await getTrackAudioFeatures(trackIdString)
        data.audio_features.forEach(item => {
          Object.keys(tempTrackVector).forEach(key => {
            tempTrackVector[key] += item[key]
          })
        })
      }

      /* take average of all track vector quantities */
      Object.keys(tempTrackVector).forEach(key => {
        tempTrackVector[key] /= trackArrayLength
      })
      console.log(tempTrackVector)
      /* store track-vector in playlist database */
      await addTrackVector(playlistId, tempTrackVector)
    }
    fetchPlaylist()
  }, [])

  const removePlaylist = async () => {
    try {
      navigate('/')
      await removePlaylistFromProfile(playlist.id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="playlist-detail">
      {playlist ? 
        <>
          <div className='playlist-card'>
            <div className="playlist-header">
              <h2>{playlist.name}</h2>
              <img src={playlist.images[0].url} alt="Playlist Image" />
            </div>
          </div>
          <div className="buttons">
            <Link to={`/recommend/${playlist.id}`}><button className='recommend'>Recommend Me</button></Link>
            <button className='remove-playlist' onClick={removePlaylist}>Remove Playlist</button>
          </div>
          <div className="tracks">
            <TrackContainer tracks={playlist.tracks.items}/>
          </div>
        </>
      : null}
    </div>
  )
}

export default PlaylistDetail