import React, { useState, useEffect, useRef } from 'react'
import { accessToken, logout, getCurrentUserProfile, getCurrentUserPlaylist, getTrackAudioFeatures, getPlaylistDetail } from '../../utils/spotify'
import { getPlaylists, getCurrentPlaylists, addPlaylists, addPlaylistToProfile, addTrackVector } from '../../utils/playlist'
import styled from 'styled-components/macro'
import Dropdown from '../Dropdown/Dropdown'
import Playlist from '../Playlist/Playlist'
import 'react-dropdown/style.css'
import './Dashboard.css'

const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`

function Dashboard({
  clearToken
}) {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState(null)
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState(null)
  const [selected, setSelected] = useState("Select a playlist to add to your profile")
  const isMounted = useRef(false)
  
  /* get value of tokens out of the URL */
  useEffect(() => {
    setSpotifyToken(accessToken)
    const fetchUserProfile = async () => {
      try {
        const { data } = await getCurrentUserProfile()
        setProfile(data)
      } catch (error) {
        console.log(error)
      }
    }
    if (accessToken) {
      fetchUserProfile()
    }
  }, [])

  useEffect(() => {
    if (isMounted.current && accessToken) {
      const addUserPlaylist = async () => {
        try {
          /* get list of playlist from Spotify API */
          const { data } = await getCurrentUserPlaylist()
          const playlists = data.items
          /* get user's profile */
          const prof = await getCurrentUserProfile()
          /* add to mongo database */
          playlists?.forEach( async (item) => {
            await addPlaylists(item, prof.data.id)
          })
        } catch (error) {
          console.log(error)
        }
      }
      if (accessToken) {
        addUserPlaylist()
      }
    } else {
      isMounted.current = true
    }
  }, [])

  useEffect(() => {
    try {
      const displayProfilePlaylists = async () => {
        const prof = await getCurrentUserProfile()
        /* retrieve playlist that belongs to user and store in playlist state */
        const result = await getPlaylists(prof.data.id)
        const options = convertToOptionsArray(result.data)
        setPlaylist(options)

        /* retrieve playlists that spotify user has added to their profile */
        const currentResult = await getCurrentPlaylists(prof.data.id)
        setCurrentPlaylist(currentResult.data)
      }
      displayProfilePlaylists()
    } catch (error) {
      console.log(error)
    }
  }, [currentAddPlaylist])

  const convertToOptionsArray = (playlist) => {
    const newArray = []
    playlist?.forEach(item => {
      newArray.push({ key: item.playlist.id, value: item, label: item.playlist.name })
    })
    return newArray
  }

  const handleAddPlaylistOnClick = () => {
    const addPlaylist = async () => {
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
      /* store track-vector in playlist database */
      await addTrackVector(currentAddPlaylist.playlistId, tempTrackVector)
      
      /* adds selected playlist to user's profile */
      await addPlaylistToProfile(currentAddPlaylist)
      setCurrentAddPlaylist(null)
      playlist.length <= 1 ? setSelected('No playlist available') : setSelected("Select a playlist to add to your profile")
    }
    addPlaylist()
  }

  const clearAllTokens = () => {
    clearToken()
    logout()
  }

  return (
    <div className="dashboard">
      {spotifyToken ? (
      <>
        {profile && (
          <div className='profile-container'>
            <h1>{profile.display_name}</h1>
            {profile.images.length > 0 ? <img className='profile-picture' src={profile.images[0].url} alt="Profile Picture"/> : null}
          </div>
        )}
        {playlist ? (
          <div>
            <Dropdown 
              options={playlist}
              selected={selected}
              setSelected={setSelected}
              setCurrentAddPlaylist={setCurrentAddPlaylist}
            />
            <button className="add-playlist" disabled={currentAddPlaylist === null} onClick={handleAddPlaylistOnClick}>Add Playlist to Profile</button>
          </div>
        ) : <h1>Loading</h1>}
        {currentPlaylist && (
          <>
            <h1>Playlist Profile</h1>
            <div className='playlist-container'>
              {currentPlaylist.map((item, idx) => (
                <Playlist key={idx} playlist={item.playlist}/>
              ))}
            </div>
          </>
        )}
      </>)
       : <StyledLoginButton className="App-link" href="http://localhost:8888/spotify/login">Log Into Spotify</StyledLoginButton>}
      <button className="logout" onClick={clearAllTokens}>Log Out</button>
      {spotifyToken ? <button onClick={logout}>Log Out of Spotify</button> : null}
    </div>
  )
}

export default Dashboard