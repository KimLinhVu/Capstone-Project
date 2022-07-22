import React from 'react'
import { useEffect, useState } from 'react'
import { getUserProfileById } from '../../utils/users'
import './UserCard.css'

function UserCard({
  userId,
  setPopupIsOpen,
  setUserPopupId
}) {
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await getUserProfileById(userId)
      setProfile(data)
    }
    getUserInfo()
  }, [])
  
  return (
    <div className='user-card' onClick={() => {
      setUserPopupId(userId)
      setPopupIsOpen(true)
      }}>
      {profile && (
        <>
          <img src=''/>
          <div className='user-info'>
            <p className='username'>{profile.username}</p>
            <p className='location'>{profile.location.formatted_address}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default UserCard