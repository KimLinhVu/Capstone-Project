import { getUserProfile, addUserFollowing, removeUserFollowing, addUserFollower, removeUserFollower } from 'utils/users'
export default class Follower {

  isUserFollowing = async (user, setIsFollowing) => {
    const { data } = await getUserProfile()
    /* check to see if current user is already following user */
    const found = data.following.some(obj => obj.userId === user._id)
    if (found) {
      setIsFollowing(true)
    } else {
      setIsFollowing(false)
    }
  }
  
  handleOnClickFollow = async (user, setIsFollowing, refresh, setRefresh) => {
    await addUserFollowing(user._id)
    await addUserFollower(user._id)
    setIsFollowing(true)
    setRefresh(!refresh)
  }

  handleOnClickUnfollow = async (user, setIsFollowing, refresh, setRefresh) => {
    await removeUserFollowing(user._id)
    await removeUserFollower(user._id)
    setIsFollowing(false)
    setRefresh(!refresh)
  }
}