import React from 'react'
import './UserCard.css'

function UserCard({
  userId,
  user,
  setPopupIsOpen,
  setUserPopupId
}) {

  return (
    <div className='user-card' onClick={() => {
      setUserPopupId(userId)
      setPopupIsOpen(true)
      }}>
      {profile && (
        <div>
          <img src='../../img/blueflower.jpeg' alt='profile placeholder'/>
          <div className='user-info'>
            <p className='username'>{profile.username}</p>
            <p className='location'>{profile.location.formatted_address}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCard