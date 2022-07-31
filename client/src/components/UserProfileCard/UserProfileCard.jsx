import React, { useContext, useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import Follower from 'utils/follower'
import { DashboardContext } from 'components/Dashboard/Dashboard'
import ReactLoading from 'react-loading'
import './UserProfileCard.css'
import { getRandomUserPlaylist, getUserPlaylists } from 'utils/playlist'
import FollowerPlaylistCard from 'components/FollowerPlaylistCard/FollowerPlaylistCard'

function UserProfileCard ({
  userId,
  setPopupIsOpen,
  currentProfile,
  spotifyProfile
}) {
  const [profile, setProfile] = useState(null)
  const [originalPlaylistId, setOriginalPlaylistId] = useState(null)
  const [vector, setVector] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(null)
  const follower = new Follower()
  const { refresh, setRefresh } = useContext(DashboardContext)

  let followButton

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

      /* gets random playlist from current user */
      const random = await getRandomUserPlaylist(spotifyProfile.id)
      setOriginalPlaylistId(random.data.playlistId)
      setVector(random.data.trackVector)

      setIsLoading(false)
    }
    getUserProfile()
  }, [])

  if (isFollowing) {
    followButton = <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(profile, setIsFollowing, refresh, setRefresh)}>Unfollow {profile?.username}</button>
  } else {
    followButton = <button className='follow' onClick={() => follower.handleOnClickFollow(profile, setIsFollowing, refresh, setRefresh)}>Follow {profile?.username}</button>
  }

  return (
    <div className="user-profile-card">
      <div id="overlay" onClick={() => setPopupIsOpen(false)}></div>
      <div className="profile-popup">
        {profile && !isLoading
          ? (
          <div>
            <div className="profile-content">
              <h1>{profile.username}</h1>
              <p>Followers: {profile.followers.length}</p>
              <p>Location: {profile.location.formatted_address}</p>
              {followButton}
            </div>
            <div className="playlists">
              { playlists?.map((item, idx) => (
                <FollowerPlaylistCard
                  key={idx}
                  playlist={item.playlist}
                  item={item}
                  user={profile}
                  profile={currentProfile}
                  originalPlaylistId={originalPlaylistId}
                  vector={vector}
                />
              ))}
            </div>
          </div>
            )
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default UserProfileCard
