import React from 'react'
import { useState, useEffect } from 'react'
import { getAllUsers, getUserPlaylists } from '../../utils/users'
import { useParams } from 'react-router-dom'
import { getPlaylistTrackVector } from '../../utils/playlist'
import User from '../User/User'

function RecommendView() {
  const [users, setUsers] = useState(null)
  const [trackVector, setTrackVector] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { playlistId } = useParams()

  useEffect(() => {
    const fetchUserTrackVector = async () => {
      /* fetches playlist track vector */
      const { data } = await getPlaylistTrackVector(playlistId)
      const vector = convertObjectToVector(data)
      setTrackVector(vector)

      /* fetches track vectors from other users' playlists and 
      calculates a similarity score */
      const result = await getAllUsers()
      setUsers(result.data)
      result.data.forEach(async (user) => {
        const { data } = await getUserPlaylists(user._id)
        data?.forEach(playlist => {
          const userVector = convertObjectToVector(playlist.trackVector)
          const similarity = calculateTrackSimilarity(vector, userVector)
          console.log(`${playlist.playlist.name} ${similarity}`)
        })
      })
    }
    fetchUserTrackVector()
  }, [])

  const convertObjectToVector = (trackObject) => {
    let resultArray = []
    Object.keys(trackObject).forEach(key => {
      resultArray.push(trackObject[key])
    })
    return resultArray
  }

  const calculateTrackSimilarity = (a, b) => {
    let dotproduct = 0
    let mA = 0
    let mB = 0
    for (let i = 0; i < a.length; i++) {
      dotproduct += (a[i] * b[i])
      mA += (a[i] * a[i])
      mB += (b[i] * b[i])
    }
    mA = Math.sqrt(mA)
    mB = Math.sqrt(mB)
    return Math.acos((dotproduct) / ((mA) * (mB))) * 1000
  }

  return (
    <div className="recommend-view">
      <h1>Recommend View</h1>
      {users ? (
        <div className="users">
          {users?.map((item, idx) => {
            return (
              <User 
                key={idx} 
                user={item} 
                userId={item._id}
                playlistId={playlistId}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default RecommendView