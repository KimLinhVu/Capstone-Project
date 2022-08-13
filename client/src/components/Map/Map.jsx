import React, { useState, useEffect } from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import ReactLoading from 'react-loading'
import './Map.css'

const libraries = ['places']

function Map ({
  userLocation,
  allUsers,
  usersLocationArray,
  setUsers,
  setIsLoading,
  center
}) {
  const [map, setMap] = useState(null)
  const [onLoad, setOnLoad] = useState(true)
  const [boundsChanged, setBoundsChanged] = useState(false)
  const [zoom, setZoom] = useState(10)
  /* show users based on map zoom and not clicking on marker */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const markerArray = [userLocation]

  const options = {
    streetViewControl: false,
    fullscreenControl: false,
    minZoom: 5,
    maxZoom: 10
  }

  useEffect(() => {
    setIsLoading(true)
    /* check which markers are currently in view of map bounds */
    setUsers([])
    markerArray?.forEach(item => {
      const inBounds = map?.getBounds()?.contains(item)
      if (inBounds) {
        handleMarkerOnBoundsChanged(item)
      }
    })
    setIsLoading(false)
  }, [boundsChanged, center])

  useEffect(() => {
    setZoom(10)
  }, [center])

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='loading'/>
  }

  const handleMarkerOnClick = async (location) => {
    setIsLoading(true)
    setUsers([])
    /* returns all users who are in the location of the marker clicked */
    const resultArray = usersLocationArray.filter(user => {
      return user.user.location.lat === location.lat && user.user.location.lng === location.lng
    })

    setUsers(old => [...old, resultArray])
    setIsLoading(false)
  }

  const handleMarkerOnBoundsChanged = async (location) => {
    setIsLoading(true)
    /* returns all users who are in the location of the marker clicked */
    const resultArray = usersLocationArray.filter(user => {
      return user.user.location.lat === location.lat && user.user.location.lng === location.lng
    })

    setUsers(old => [...old, resultArray])
    setIsLoading(false)
  }

  return (
    <GoogleMap
      zoom={zoom}
      center={center}
      options={options}
      mapContainerClassName="map-container"
      onZoomChanged={() => setBoundsChanged(!boundsChanged)}
      onDragEnd={() => setBoundsChanged(!boundsChanged)}
      onBoundsChanged={() => {
        if (onLoad) {
          setBoundsChanged(!boundsChanged)
          setOnLoad(false)
        }
      }}
      onLoad={map => {
        setMap(map)
      }}
    >
      <Marker
        position={userLocation}
        onClick={(e) => (handleMarkerOnClick(e.latLng.toJSON()))}
        icon={{
          url: require('img/user.png')
        }}
      />
      <Marker
        position={center}
        onClick={(e) => (handleMarkerOnClick(e.latLng.toJSON()))}
        icon={{
          url: require('img/user.png')
        }}
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
            onClick={(e) => (handleMarkerOnClick(e.latLng.toJSON()))}
            icon={{
              url: require('img/music.png')
            }}
          />)
        }
      })}
    </GoogleMap>
  )
}

export default Map
