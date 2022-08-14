import React, { useState } from 'react'
import Dropdown from 'components/Dropdown/Dropdown'
import PlaylistCard from 'components/PlaylistCard/PlaylistCard'
import { addTrackVector, addPlaylistToProfile, saveSimilarityScores } from 'utils/playlist'
import { AiFillPlusCircle } from 'react-icons/ai'
import { Tooltip } from '@mui/material'
import ReactLoading from 'react-loading'
import Tracks from 'utils/tracks'
import './PlaylistView.css'

function PlaylistView ({
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
  const track = new Tracks()

  const handleAddPlaylistOnClick = async () => {
    setIsLoading(true)

    /* creates a track vector object out of all tracks in a playlist */
    const trackVector = await track.createTrackVector(currentAddPlaylist.playlistId, setPlaylist)

    /* store track-vector in playlist database */
    await addTrackVector(currentAddPlaylist.playlistId, trackVector)

    /* adds selected playlist to user's profile */
    await addPlaylistToProfile(currentAddPlaylist)
    setCurrentAddPlaylist(null)

    /* save similarity scores between all playlists in db */
    await saveSimilarityScores(currentAddPlaylist.playlistId, trackVector)

    setRefresh(!refresh)
    setIsLoading(false)
  }

  return (
    <div className='playlist-view'>
      <div className="playlist-header">
        <input type="text" placeholder='Search For A Playlist' className='playlist-searchbar' value={playlistSearch} onChange={(e) => setPlaylistSearch(e.target.value)}/>
        <div className='playlist-action'>
          {playlist
            ? (
            <Dropdown
             options={playlist}
             selected={selected}
             setSelected={setSelected}
             setCurrentAddPlaylist={setCurrentAddPlaylist}
             refresh={refresh}
             isLoading={isLoading}
           />
              )
            : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
          <Tooltip title='Add Playlist'>
            <button className="add-playlist-btn" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}><AiFillPlusCircle size={45} className='icon'/></button>
          </Tooltip>
        </div>
      </div>
        <div className='playlist-container'>
          <div className="header">
            <h3>My Playlists</h3>
          </div>
          {displayPlaylist && !isLoading
            ? (
            <div className="playlists">
            {displayPlaylist.length !== 0
              ? displayPlaylist.map((item, idx) => (
              <PlaylistCard
                key={idx}
                favorite={item.favorite}
                playlist={item.playlist}
                refresh={refresh}
                setRefresh={setRefresh}
                setIsLoading={setIsLoading}
                otherUser={false}
              />
              ))
              : <p>No Playlists Found</p>}
          </div>)
            : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default PlaylistView
