
import React, { useEffect, useState } from 'react'
import Image from 'utils/image'
import './UserCard.css'

function UserCard ({
  userId,
  user,
  setPopupIsOpen,
  setUserPopupId
}) {
  const [profilePicture, setProfilePicture] = useState(null)
  const image = new Image()
  let profileImage

  useEffect(() => {
    const getProfilePicture = async () => {
      const { data } = await image.getUserProfilePicture(userId)
      setProfilePicture(data)
    }
    getProfilePicture()
  }, [])

  if (profilePicture) {
    profileImage = <img src={profilePicture}/>
  } else {
    profileImage = <img src={require('img/blueflower.jpeg')}/>
  }

  return (
    <div className='user-card' onClick={() => {
      setUserPopupId(userId)
      setPopupIsOpen(true)
    }}>
      {profileImage}
      {user
        ? (
        <div className='user-info'>
        <p className='username'>{user.username}</p>
        <p className='location'>{user.location.formatted_address}</p>
      </div>
          )
        : null}
    </div>
  )
}

export default UserCard
