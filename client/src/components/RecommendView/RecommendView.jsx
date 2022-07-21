import React, { useState, useEffect } from 'react'
import { getAllUsers, getUserProfile } from 'utils/users'
import { useParams } from 'react-router-dom'
import { getPlaylistTrackVector } from 'utils/playlist'
import UserPlaylist from 'components/UserPlaylist/UserPlaylist'
import Map from 'components/Map/Map'
import ReactLoading from 'react-loading'
import NavBar from 'components/NavBar/NavBar'
import './RecommendView.css'

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
  const [userSearch, setUserSearch] = useState([])
  const { playlistId } = useParams()

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)

      /* get current user profile and set location */
      const { data } = await getUserProfile()
      setProfile(data)
      setUserLocation(data.location.geometry.location)

      /* fetches filtered users in database and adds them to a location array */
      const result = await getAllUsers(data.followers)
      setAllUsers(result.data)
      const userArray = addUsersToLocationArray(result.data)
      setUsersLocationArray(userArray)

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
      /* sorts users array by similarity score */
      const newArray = users.sort((a, b) => {
        return b.similarityScore - a.similarityScore
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

  return (
    <div className="recommend-view">
      <NavBar />
      <div className="users">
        <div className="header">
          <input type="text" placeholder='Search For A User' value={userSearch} onChange={(e) => setUserSearch(e.target.value)}/>
        </div>
        {!isLoading
          ? displayUsers?.length !== 0 && displayUsers !== null
            ? displayUsers?.map((item, idx) => {
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
            : <p className='no-users'>No Users Found</p>
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
      {!isLoading
        ? (
        <Map
          userLocation={userLocation}
          allUsers={allUsers}
          usersLocationArray={usersLocationArray}
          playlistId={playlistId}
          setUsers={setUsers}
          similarityMethod={profile?.similarityMethod}
          setIsLoading={setIsLoading}
        />
          )
        : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
    </div>
  )
}

export default RecommendView