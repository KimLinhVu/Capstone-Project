import React from 'react'
import { useState, useEffect } from 'react'
import { getAllUsers } from '../../utils/users'
import { useParams } from 'react-router-dom'
import User from '../User/User'

function RecommendView() {
  const [users, setUsers] = useState(null)
  const { playlistId } = useParams()

  useEffect(() => {
    const fetchAllUsers = async () => {
      const { data } = await getAllUsers()
      setUsers(data)
      console.log(data)
    }
    fetchAllUsers()
  }, [])

  return (
    <div className="recommend-view">
      <h1>Recommend View</h1>
      {users ? (
        <div className="users">
          {users.map((item, idx) => {
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