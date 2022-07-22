import React from 'react'
import { useState, useMemo } from 'react'
import { getUserPlaylists } from 'utils/users'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import ReactLoading from 'react-loading'

function Map({
  userLocation,
  allUsers,
  usersLocationArray,
  vector,
  setUsers,
  similar,
  similarityMethod,
  setIsLoading
}) {
  const [map, setMap] = useState(null)
  /* show users based on map zoom and not clicking on marker */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })

  let markerArray = [userLocation]
  const center = useMemo(() => (userLocation), [])

  const options = {
    streetViewControl: false,
    fullscreenControl: false,
    
  }

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='loading'/>
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
        const userVector = similar.convertObjectToVector(playlist.trackVector)

        /* use random similarity method associated with user */
        let similarity = 0
        if (similarityMethod === 0) {
          similarity = similar.calculateCosineSimilarity(vector, userVector)
        } else {
          similarity = similar.calculateOwnSimilarity(vector, userVector)
        }
        
        const newTrackObject = { user: user, playlist: playlist, similarityScore: similarity}
        setUsers(old => [...old, newTrackObject])
      })
    })
  }

  const onBoundsChanged = () => {
    setIsLoading(true)
    /* check which markers are currently in view of map bounds */
    markerArray.forEach(item => {
      const inBounds = map?.getBounds().contains(item)
      if (inBounds) {
        handleMarkerOnClick(item)
      }
    })
    setIsLoading(false)
  }

  return (
    <GoogleMap
      zoom={8}
      center={center}
      options={options}
      mapContainerClassName="map-container"
      onZoomChanged={onBoundsChanged}
      onLoad={map => {
        setMap(map)
      }}
    >
      <Marker 
        position={center}
        label='User Location'
        onClick={(e) => (handleMarkerOnClick(e.latLng.toJSON()))}
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

export default Map