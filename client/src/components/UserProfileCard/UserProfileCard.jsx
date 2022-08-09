import React, { useEffect, useState } from 'react'
import { getUserProfileById } from 'utils/users'
import { MdLocationOn } from 'react-icons/md'
import { AiFillCloseCircle } from 'react-icons/ai'
import Follower from 'utils/follower'
import ReactLoading from 'react-loading'
import './UserProfileCard.css'
import { getRandomUserPlaylist, getUserPlaylists } from 'utils/playlist'
import FollowerPlaylistCard from 'components/FollowerPlaylistCard/FollowerPlaylistCard'
import Image from 'utils/image'

function UserProfileCard ({
  userId,
  setPopupIsOpen,
  currentProfile,
  spotifyProfile
}) {
  const [profile, setProfile] = useState(null)
  const [profilePicture, setProfilePicture] = useState(null)
  const [originalPlaylistId, setOriginalPlaylistId] = useState(null)
  const [vector, setVector] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const follower = new Follower()

  let followButton
  let profileImage

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
    const getProfilePicture = async () => {
      const { data } = await Image.getUserProfilePicture(userId)
      setProfilePicture(data)
    }
    getProfilePicture()
    getUserProfile()
  }, [])

  if (isFollowing) {
    followButton = <button className='unfollow' onClick={() => follower.handleOnClickUnfollow(profile, setIsFollowing, refresh, setRefresh)}>Unfollow {profile?.username}</button>
  } else {
    followButton = <button className='follow' onClick={() => follower.handleOnClickFollow(profile, setIsFollowing, refresh, setRefresh)}>Follow {profile?.username}</button>
  }

  if (profilePicture === null) {
    profileImage = spotifyProfile.images.length > 0 ? <img className='profile-picture' src={spotifyProfile.images[0].url} alt="profile picture" /> : <img className='profile-picture' src={require('img/blueflower.jpeg')}/>
  } else {
    profileImage = <img className='profile-picture' src={profilePicture} alt="profile picture"/>
  }

  return (
    <div className="user-profile-card">
      <div id="overlay" onClick={() => setPopupIsOpen(false)}></div>
      <div className="profile-popup">
        {profile && !isLoading
          ? (
          <div>
            <AiFillCloseCircle size={35} className='playlist-close-btn' onClick={() => setPopupIsOpen(false)}/>
            <div className="profile-content">
              <div className="profile-content-user">
                <div className="profile-picture">
                  {profileImage}
                </div>
                <div className="user-left">
                  <h1>{profile.username}</h1>
                  <p className='follower'>{profile.followers.length} {profile.followers.length === 1 ? 'follower' : 'followers'}</p>
                  <div className="location">
                    <MdLocationOn className='icon' size={23}/>
                    <p>{profile.location.formatted_address}</p>
                  </div>
                </div>
              </div>
              <div className="user-right">
                {followButton}
              </div>
            </div>
            <hr />
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
