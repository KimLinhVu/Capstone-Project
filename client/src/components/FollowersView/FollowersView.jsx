import React from 'react'
import UserCard from 'components/UserCard/UserCard'
import './FollowersView.css'

function FollowersView({
  profile,
  followers
}) {
  const users = followers ? profile.followers : profile.following
  let userCards;

  if (users.length === 0) {
    userCards = <p>No followers</p>
  } else {
    userCards = users.map((item, idx) => {
      return <UserCard key={idx} userId={item.userId} />
    })
  }
  return (
    <div className="followers-view">
      <div className="playlist-container">
        <div className="header">
          <h3>{followers ? `${profile.username}'s Followers` : 'Following'}</h3>
        </div>
        <div className="playlists">
          {userCards}
        </div>
      </div>
    </div>
  )
}

export default FollowersView