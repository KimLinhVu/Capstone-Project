import React, { useState, useEffect, useRef } from 'react'
import { getAllUsers, getUserProfile, getUserPlaylists } from 'utils/users'
import { useParams } from 'react-router-dom'
import { getPlaylistTrackVector, getSimilarityScore } from 'utils/playlist'
import UserPlaylist from 'components/UserPlaylist/UserPlaylist'
import Map from 'components/Map/Map'
import ReactLoading from 'react-loading'
import NavBar from 'components/NavBar/NavBar'
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdClose } from 'react-icons/io'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { AiOutlineSearch } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify'
import { notifyError } from 'utils/toast'
import './RecommendView.css'

const libraries = ['places']

function RecommendView () {
  const [profile, setProfile] = useState(null)
  const [allUsers, setAllUsers] = useState(null)
  const [currentUsers, setCurrentUsers] = useState([])
  const [displayUsers, setDisplayUsers] = useState([])
  const [users, setUsers] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [usersLocationArray, setUsersLocationArray] = useState([])
  const [vector, setVector] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [locationIsLoading, setLocationIsLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [filterSimilarity, setFilterSimilarity] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(null)
  const [center, setCenter] = useState(userLocation)
  const [searchFocus, setSearchFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const mapSearchInput = useRef()
  const { playlistId } = useParams()

  let filterSimilarityButton
  let userCards

  /* set up Google Map Places autocomplete */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      /* get current user profile and set location */
      const { data } = await getUserProfile()
      setProfile(data)
      setUserLocation(data.location.geometry.location)
      setCenter(data.location.geometry.location)

      /* fetches filtered users in database and adds them to a location array */
      const result = await getAllUsers(data.followers)
      setAllUsers(result.data)
      const userArray = addUsersToLocationArray(result.data)

      const promises = userArray.map(async (user) => {
        const { data } = await getUserPlaylists(user.user._id)
        data?.map(async (playlist) => {
          const userVector = playlist.trackVector

          const res = await getSimilarityScore(playlistId, playlist.playlistId, user.user.similarityMethod)
          const similarityScore = res.data

          const newTrackObject = { user, playlist, similarityScore, userVector }
          setUsersLocationArray(old => [...old, newTrackObject])
        })
      })
      await Promise.all(promises)

      /* fetches playlist track vector */
      const trackVector = await getPlaylistTrackVector(playlistId)
      setVector(trackVector.data)

      setIsLoading(false)
    }
    fetchUserProfile()
  }, [])

  useEffect(() => {
    if (users.length === 0) {
      setDisplayUsers(null)
    } else {
      /* sorts users array by similarity score filter */
      let newArray = users.flat().sort((a, b) => {
        return b.similarityScore - a.similarityScore
      })
      if (filterSimilarity) {
        newArray = users.flat().slice().reverse()
      }
      setCurrentUsers(newArray)
      setDisplayUsers(newArray)
    }
  }, [users])

  useEffect(() => {
    /* displays users included in search input */
    const newArray = currentUsers?.flat().filter(item => item.user.user.username.toLowerCase().includes(userSearch.toLowerCase()))
    if (filterSimilarity) {
      newArray.reverse()
    }
    setDisplayUsers(newArray)
  }, [userSearch, filterSimilarity])

  useEffect(() => {
    if (place !== null) {
      setCenter(place.geometry.location)
    }
  }, [place])

  const addUsersToLocationArray = (users) => {
    const resultArray = []
    users.forEach(user => {
      const locationName = user.location.name
      const location = user.location.geometry.location
      const newObj = {
        locationName,
        location,
        user
      }
      resultArray.push(newObj)
    })
    return resultArray
  }

  if (filterSimilarity) {
    filterSimilarityButton = <IoMdArrowDropup className='filter'/>
  } else {
    filterSimilarityButton = <IoMdArrowDropdown className='filter'/>
  }

  if (isLoading) {
    userCards = <ReactLoading color='#B1A8A6' type='spin' className='loading'/>
  } else if (displayUsers?.length !== 0 && displayUsers !== null) {
    userCards = displayUsers?.flat().map((item, idx) => {
      return (
        <UserPlaylist
          key={idx}
          following={profile.following}
          user={item.user.user}
          playlist={item.playlist.playlist}
          similarity={item.similarityScore.toFixed(2)}
          similarityMethod={profile.similarityMethod}
          userId={item.playlist.userId}
          playlistId={playlistId}
          vector={vector}
          userVector={item.userVector}
        />
      )
    })
  } else {
    userCards = <p className='no-users'>No Users Found</p>
  }

  const onPlaceChanged = () => {
    /* sets place state only if user chooses an autocorrect option */
    if (autocomplete !== null) {
      const placeObject = autocomplete.getPlace()
      if (Object.keys(placeObject).length <= 1) {
        setPlace(null)
      } else {
        setPlace(placeObject)
        setSearchValue(placeObject.formatted_address)
      }
    } else {
      setPlace(null)
    }
  }

  /* set up city/state autocomplete */
  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const handleCurrentLocation = async () => {
    setLocationIsLoading(true)
    const success = (position) => {
      const coordinates = { lat: position.coords.latitude, lng: position.coords.longitude }
      setCenter(coordinates)
      setLocationIsLoading(false)
    }
    const error = () => {
      notifyError('Permission to access location denied')
      setLocationIsLoading(false)
    }
    navigator.geolocation.getCurrentPosition(success, error)
  }

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='recommend-loading'/>
  }

  return (
    <div className="recommend-view">
      <NavBar />
      <button className={locationIsLoading ? 'get-location-btn inactive' : 'get-location-btn'} disabled={locationIsLoading} onClick={handleCurrentLocation}>Navigate to Current Location</button>
      <div className="map-filter">
        <AiOutlineSearch className={searchFocus ? 'search-icon focus' : 'search-icon'} size={25}/>
        <IoMdClose onClick={() => {
          setSearchValue('')
          mapSearchInput.current.focus()
        }} className='clear-search' size={26}/>
        <Autocomplete
          types={['locality']}
          restrictions={{ country: ['us'] }}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input type="text"
            placeholder='Search By Location'
            className='map-filter-input'
            onChange={(e) => {
              setPlace(null)
              setSearchValue(e.target.value)
            }}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            value={searchValue}
            ref={mapSearchInput}
          />
        </Autocomplete>
      </div>
      <div className="users">
        <div className="header">
          <AiOutlineSearch className={searchFocus ? 'search-icon user focus' : 'search-icon user'} size={20}/>
          <input
            type="text"
            placeholder='Search By User'
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <span className='filter-similarity' onClick={() => setFilterSimilarity(!filterSimilarity)}>Similarity{filterSimilarityButton}</span>
        </div>
        {userCards}
      </div>
      {!isLoading
        ? (
        <Map
          userLocation={userLocation}
          allUsers={allUsers}
          usersLocationArray={usersLocationArray}
          setUsers={setUsers}
          setIsLoading={setIsLoading}
          center={center}
        />
          )
        : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default RecommendView
