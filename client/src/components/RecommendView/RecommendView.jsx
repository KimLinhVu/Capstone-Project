import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { getAllUsers, getUserPlaylists, getUserLocation } from '../../utils/users'
import { useParams } from 'react-router-dom'
import { getPlaylistTrackVector } from '../../utils/playlist'
import { convertObjectToVector, calculateTrackSimilarity } from '../../utils/similarity'
import UserPlaylist from '../UserPlaylist/UserPlaylist'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import "./RecommendView.css"

function RecommendView() {
  const [allUsers, setAllUsers] = useState(null)
  const [currentUsers, setCurrentUsers] = useState([])
  const [displayUsers, setDisplayUsers] = useState(null)
  const [users, setUsers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [usersLocationArray, setUsersLocationArray] = useState([])
  const [vector, setVector] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userSearch, setUserSearch] = useState([])
  const { playlistId } = useParams()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

  useEffect(() => {
    const fetchUserLocation = async () => {
      setIsLoading(true)
      /* gets logged in user's location */
      const { data } = await getUserLocation()
      const location = data.geometry.location
      setUserLocation(location)
      setIsLoading(false)
    }
    const fetchUserTrackVector = async () => {
      /* fetches playlist track vector */
      const { data } = await getPlaylistTrackVector(playlistId)
      const vector = convertObjectToVector(data)
      setVector(vector)

      /* fetches all users in database and adds them to a location array */
      setIsLoading(true)
      const result = await getAllUsers()
      setAllUsers(result.data)
      const userArray = addUsersToLocationArray(result.data)
      setUsersLocationArray(userArray)
      setIsLoading(false)
    }
    fetchUserTrackVector()
    fetchUserLocation()
  }, [])

  useEffect(() => {
    if (users.length === 0) {
      setDisplayUsers(null)
    } else {
      /* sorts users array by similarity score */
      let newArray = users.sort((a, b) => {
        return a.similarityScore - b.similarityScore
      })
      setCurrentUsers(newArray)
      setDisplayUsers(newArray)
    }
  }, [users])

  useEffect(() => {
    /* displays users included in search input */
    const newArray = currentUsers?.filter(item => item.user.user.username.toLowerCase().includes(userSearch.toLowerCase()))
    setDisplayUsers(newArray)
  }, [userSearch])

  const addUsersToLocationArray = (users) => {
    let resultArray = []
    users.forEach(user => {
      const locationName = user.location.name
      const location = user.location.geometry.location
      const newObj = {
        locationName: locationName,
        location: location,
        user: user
      }
      resultArray.push(newObj)
    })
    return resultArray
  }

  if (!isLoaded) {
    return <h1>Loading</h1>
  }

  return (
    <div className="recommend-view">
      <div className="users">
        <h2>Users</h2>
        <input type="text" placeholder='Search For A User' value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
        {displayUsers ? displayUsers.map((item, idx) => {
          return (
            <UserPlaylist 
              key={idx}
              user={item.user.user}
              playlist={item.playlist.playlist}
              similarity={item.similarityScore.toFixed(2)}
              userId={item.playlist.userId}
              playlistId={playlistId}
            />
          )
        }) : <p>Click On a Location</p>}
      </div>
      {!isLoading ? (
        <Map 
        userLocation={userLocation}
        allUsers={allUsers}
        usersLocationArray={usersLocationArray}
        vector={vector}
        setUsers={setUsers}
        />
      ): <h1>Loading...</h1>}
    </div>
  )
}

function Map({
  userLocation,
  allUsers,
  usersLocationArray,
  vector,
  setUsers
}) {
  let markerArray = [userLocation]
  const center = useMemo(() => (userLocation), [])

  const options = {
    streetViewControl: false,
    fullscreenControl: false
  }

  const handleMarkerOnClick = (location) => {
    /* returns all users who are in the location of the marker clicked */
    const resultArray = usersLocationArray.filter(user => {
      return user.location.lat === location.lat && user.location.lng === location.lng
    })

    /* calculate similarity score for each user's playlists */
    resultArray.forEach(async (user) => {
      setUsers([])
      const { data } = await getUserPlaylists(user.user._id)
      data?.forEach(playlist => {
        const userVector = convertObjectToVector(playlist.trackVector)
        const similarity = calculateTrackSimilarity(vector, userVector)
        const newTrackObject = { user: user, playlist: playlist, similarityScore: similarity}
        setUsers(old => [...old, newTrackObject])
      })
    })
  }

  return (
    <GoogleMap
      zoom={8}
      center={center}
      options={options}
      mapContainerClassName="map-container"
    >
      <Marker 
        position={center}
        label='User Location'
      />
      {allUsers?.map((user, idx) => {
        const position = user.location.geometry.location
        
        /* checks if marker already exists on map */
        const found = markerArray.some(obj => obj.lat === position.lat && obj.lng === position.lng)

        /* if marker does not exist, add it to map */
        if (!found) {
          markerArray.push(position)
          return (
          <Marker 
            key={idx} 
            position={position} 
            label={user.location.name}
            onClick={(e) => (handleMarkerOnClick(e.latLng.toJSON()))}
          />)
        }
      })}
    </GoogleMap>
  )
}

export default RecommendView