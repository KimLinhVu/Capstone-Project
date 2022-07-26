import React, { useState, useEffect } from 'react'
import UserCard from 'components/UserCard/UserCard'
import './FollowersView.css'
import { getUserProfileById } from 'utils/users'

function FollowersView ({
  profile,
  followers,
  setPopupIsOpen,
  setUserPopupId
}) {
  const [followerSearch, setFollowerSearch] = useState('')
  const [users, setUsers] = useState(null)
  const [displayUsers, setDisplayUsers] = useState([])

  const userArray = followers ? profile.followers : profile.following

  useEffect(() => {
    const getUserInfo = async () => {
      let newArray = []
      const promises = userArray.map(async (item) => {
        const { data } = await getUserProfileById(item.userId)
        newArray.push(data)
      })
      await Promise.all(promises)

      /* filter out private users */
      newArray = newArray.filter(user => {
        if (user.privacy && !user.showFollowing) {
          return false
        }
        return true
      })

      setUsers(newArray)
      setDisplayUsers(newArray)
    }
    getUserInfo()
  }, [profile])

  useEffect(() => {
    const newArray = users?.filter(item => { return item.username.toLowerCase().includes(followerSearch.toLowerCase()) })
    setDisplayUsers(newArray)
  }, [followerSearch, profile])

  return (
    <div className="followers-view">
      <input type="text" placeholder='Search Users' className='follower-searchbar' value={followerSearch} onChange={(e) => setFollowerSearch(e.target.value)}/>
      <div className="playlist-container">
        <div className="header">
          <h3>{followers ? `${profile.username}'s Followers` : 'Following'}</h3>
        </div>
        <div className="playlists">
          {displayUsers?.length !== 0
            ? (
                displayUsers?.map((item, idx) => {
                  return <UserCard key={idx} userId={item._id} user={item} setPopupIsOpen={setPopupIsOpen} setUserPopupId={setUserPopupId}/>
                })
              )
            : <p>No Users Found</p>}
        </div>
      </div>
    </div>
  )
}

export default FollowersView
