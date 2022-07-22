import React from 'react'
import UserCard from 'components/UserCard/UserCard'
import './FollowersView.css'

function FollowersView({
  profile,
  followers,
  setPopupIsOpen,
  setUserPopupId
}) {
  const users = followers ? profile.followers : profile.following
  return (
    <div className="followers-view">
      <div className="playlist-container">
        <div className="header">
          <h3>{followers ? `${profile.username}'s Followers` : 'Following'}</h3>
        </div>
        <div className="playlists">
          {users.length !== 0 ? (
            users.map((item, idx) => {
              return <UserCard key={idx} userId={item.userId} setPopupIsOpen={setPopupIsOpen} setUserPopupId={setUserPopupId}/>
            })
          ): <p>No followers</p>}
        </div>
      </div>
    </div>
  )
}

export default FollowersView