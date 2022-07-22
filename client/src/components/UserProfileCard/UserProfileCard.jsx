import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import Follower from 'utils/follower'
import { DashboardContext } from 'components/Dashboard/Dashboard'
import './UserProfileCard.css'

function UserProfileCard({
  userId,
  setPopupIsOpen
}) {
  const [profile, setProfile] = useState(null)
  const [isFollowing, setIsFollowing] = useState(null)
  const follower = new Follower()
  const {refresh, setRefresh} = useContext(DashboardContext)

  useEffect(() => {
    const getUserProfile = async () => {
      const { data } = await getUserProfileById(userId)
      console.log(data)
      setProfile(data)

      follower.isUserFollowing(data, setIsFollowing)

    }
    getUserProfile()
  }, [])

  return (
    <div className="user-profile-card">
      <div id="overlay" onClick={() => setPopupIsOpen(false)}></div>
      <div className="profile-popup">
        {profile ? (
          <div className="profile-content">
            <h1>{profile.username}</h1>
            <p>Followers: {profile.followers.length}</p>
            <p>Location: {profile.location.formatted_address}</p>
            {isFollowing ? <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(profile, setIsFollowing, refresh, setRefresh)}>Unfollow {profile.username}</button> : <button className='follow' onClick={() => follower.handleOnClickFollow(profile, setIsFollowing, refresh, setRefresh)}>Follow {profile.username}</button>}
          </div>
        ) : <h1>Loading...</h1>}
      </div>
    </div>
  )
}

export default UserProfileCard