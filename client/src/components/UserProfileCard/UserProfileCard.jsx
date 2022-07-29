import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import Follower from 'utils/follower'
import { DashboardContext } from 'components/Dashboard/Dashboard'
import ReactLoading from 'react-loading'
import './UserProfileCard.css'
import { getUserPlaylists } from 'utils/playlist'
import PlaylistCard from 'components/PlaylistCard/PlaylistCard'

function UserProfileCard({
  userId,
  setPopupIsOpen
}) {
  const [profile, setProfile] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(null)
  const follower = new Follower()
  const {refresh, setRefresh} = useContext(DashboardContext)

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true)
      /* gets user-card profile */
      const { data } = await getUserProfileById(userId)
      setProfile(data)
      follower.isUserFollowing(data, setIsFollowing)

      /* get user's added playlists */
      const result = await getUserPlaylists(userId)
      setPlaylists(result.data)

      setIsLoading(false)
    }
    getUserProfile()
  }, [])

  return (
    <div className="user-profile-card">
      <div id="overlay" onClick={() => setPopupIsOpen(false)}></div>
      <div className="profile-popup">
        {profile && !isLoading ? (
          <div>
            <div className="profile-content">
              <h1>{profile.username}</h1>
              <p>Followers: {profile.followers.length}</p>
              <p>Location: {profile.location.formatted_address}</p>
              {isFollowing ? <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(profile, setIsFollowing, refresh, setRefresh)}>Unfollow {profile.username}</button> : <button className='follow' onClick={() => follower.handleOnClickFollow(profile, setIsFollowing, refresh, setRefresh)}>Follow {profile.username}</button>}
            </div>
            <div className="playlists">
              { playlists?.map((item, idx) => (
                <PlaylistCard 
                  key={idx} 
                  playlist={item.playlist}
                  setIsLoading={setIsLoading}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  otherUser={true}
                />
              ))}
            </div>
          </div>
        ) :  <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default UserProfileCard