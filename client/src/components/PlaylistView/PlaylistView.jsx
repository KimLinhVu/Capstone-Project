import React from 'react'
import { useState } from 'react'
import Dropdown from '../Dropdown/Dropdown'
import PlaylistCard from '../PlaylistCard/PlaylistCard'
import { getPlaylistDetail, getTracksAudioFeatures } from 'utils/spotify'
import { addTrackVector } from 'utils/playlist'
import { addPlaylistToProfile } from 'utils/playlist'
import { AiFillPlusCircle } from "react-icons/ai";
import { Tooltip  } from '@mui/material'
import ReactLoading from 'react-loading'
import './PlaylistView.css'

function PlaylistView({
  playlist,
  selected,
  setSelected,
  setCurrentAddPlaylist,
  currentAddPlaylist,
  playlistSearch,
  setPlaylistSearch,
  displayPlaylist,
  setPlaylist,
  spotifyName,
  refresh,
  setRefresh
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddPlaylistOnClick = () => {
    const addPlaylist = async () => {
      setIsLoading(true)
      /* calculate track vector for playlist */
      const { data } = await getPlaylistDetail(currentAddPlaylist.playlistId)
      setPlaylist(data)
      
      /* create string of track Ids to use in Spotify API */
      let trackIdArray = []
      const tracks = data.tracks.items
      tracks.forEach(item => {
        const id = item.track.id
        trackIdArray.push(id)
      })

      /* receive track audio features for each track and store in an array */
      let trackArrayLength = trackIdArray.length
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
        const { data } = await getTracksAudioFeatures(trackIdString)
        // eslint-disable-next-line no-loop-func
        data.audio_features.forEach(item => {
          if (item !== null) {
            Object.keys(tempTrackVector).forEach(key => {
              tempTrackVector[key] += item[key]
            })
          } else {
            trackArrayLength -= 1
          }
        })
      }

      /* take average of all track vector quantities */
      Object.keys(tempTrackVector).forEach(key => {
        tempTrackVector[key] /= trackArrayLength
      })
      /* store track-vector in playlist database */
      await addTrackVector(currentAddPlaylist.playlistId, tempTrackVector)
      
      /* adds selected playlist to user's profile */
      await addPlaylistToProfile(currentAddPlaylist)
      setCurrentAddPlaylist(null)
      playlist.length <= 1 ? setSelected('No playlist available') : setSelected("Add a playlist")

      setIsLoading(false)
    }
    addPlaylist()
  }

  return (
    <div className='playlist-view'>
      <div className="playlist-header">
        <input type="text" placeholder='Search For A Playlist' className='playlist-searchbar' value={playlistSearch} onChange={(e) => setPlaylistSearch(e.target.value)}/>
        <div className='playlist-action'>
          {playlist ? (
            <Dropdown 
             options={playlist}
             selected={selected}
             setSelected={setSelected}
             setCurrentAddPlaylist={setCurrentAddPlaylist}
           />
          ) : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
          <Tooltip title='Add Playlist'>
            <button className="add-playlist-btn" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}><AiFillPlusCircle size={45} className='icon'/></button>
          </Tooltip>
        </div>
      </div>
        <div className='playlist-container'>
          <div className="header">
            <h3>{spotifyName}'s Playlists</h3>
          </div>
          {displayPlaylist && !isLoading ? (
            <div className="playlists">
            {displayPlaylist.length !== 0 ? displayPlaylist.map((item, idx) => (
              <PlaylistCard 
                key={idx}
                favorite={item.favorite}
                playlist={item.playlist}
                refresh={refresh}
                setRefresh={setRefresh}
                setIsLoading={setIsLoading}
              />
            )) : <p>No Playlists Found</p>}
          </div>) : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default PlaylistView