import React, { useState, useMemo } from 'react'
import { getUserPlaylists } from 'utils/users'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { getSimilarityScore } from 'utils/playlist'
import ReactLoading from 'react-loading'

const libraries = ['places']

function Map ({
  userLocation,
  allUsers,
  usersLocationArray,
  playlistId,
  setUsers,
  similarityMethod,
  setIsLoading
}) {
  const [map, setMap] = useState(null)
  const [onLoad, setOnLoad] = useState(true)
  /* show users based on map zoom and not clicking on marker */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const markerArray = [userLocation]
  const center = useMemo(() => (userLocation), [])

  const options = {
    streetViewControl: false,
    fullscreenControl: false
  }

  const onBoundsChanged = () => {
    setIsLoading(true)
    /* check which markers are currently in view of map bounds */
    setUsers([])
    markerArray?.forEach(item => {
      const inBounds = map?.getBounds()?.contains(item)
      if (inBounds) {
        handleMarkerOnClick(item)
      }
    })
    setIsLoading(false)
  }

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='loading'/>
  }

  const handleMarkerOnClick = async (location) => {
    setIsLoading(true)
    /* returns all users who are in the location of the marker clicked */
    const resultArray = usersLocationArray.filter(user => {
      return user.location.lat === location.lat && user.location.lng === location.lng
    })

    /* fetch similarity score for each user's playlists */
    resultArray.map(async (user) => {
      setUsers([])
      const { data } = await getUserPlaylists(user.user._id)
      data?.map(async (playlist) => {
        const userVector = playlist.trackVector

        const res = await getSimilarityScore(playlistId, playlist.playlistId, similarityMethod)
        const similarityScore = res.data

        const newTrackObject = { user, playlist, similarityScore, userVector }
        setUsers(old => [...old, newTrackObject])
      })
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
      onDragEnd={onBoundsChanged}
      onBoundsChanged={() => {
        if (onLoad) {
          onBoundsChanged()
          setOnLoad(false)
        }
      }}
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
