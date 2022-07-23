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
      <img src=''/>
      {user ? (
        <div className='user-info'>
        <p className='username'>{user.username}</p>
        <p className='location'>{user.location.formatted_address}</p>
      </div>
      ) : null}
    </div>
  )
}

export default UserCard